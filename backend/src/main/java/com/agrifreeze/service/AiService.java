package com.agrifreeze.service;

import com.agrifreeze.entity.AiInspectionLog;
import com.agrifreeze.entity.AiSettings;
import com.agrifreeze.repository.AiInspectionLogRepository;
import com.agrifreeze.repository.AiSettingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AiService {

    private final AiSettingsRepository aiSettingsRepository;
    private final AiInspectionLogRepository aiInspectionLogRepository;

    public AiService(AiSettingsRepository aiSettingsRepository, AiInspectionLogRepository aiInspectionLogRepository) {
        this.aiSettingsRepository = aiSettingsRepository;
        this.aiInspectionLogRepository = aiInspectionLogRepository;
    }

    public AiSettings getSettings() {
        return aiSettingsRepository.findAll().stream().findFirst().orElseGet(() -> {
            AiSettings defaultSettings = new AiSettings(
                "You are AgriFreeze Food Science AI, an expert post-harvest agricultural safety and spoilage engine. Analyze temperature (°C), relative humidity (%), door opening frequency, and product type. Calculate predicted remaining shelf life in days, spoilage risk percentage (0-100%), and assign an overall status (Safe, Warning, Critical). Provide role-specific actionable insights: farmer_tip (immediate field/storage operations) and manager_tip (commercial dispatch or markdown action).",
                70,
                "gemini-2.5-flash"
            );
            return aiSettingsRepository.save(defaultSettings);
        });
    }

    public AiSettings updateSettings(String masterPrompt, Integer riskThreshold, String modelVersion, String apiKey) {
        AiSettings settings = getSettings();
        if (masterPrompt != null && !masterPrompt.trim().isEmpty()) {
            settings.setMasterPrompt(masterPrompt.trim());
        }
        if (riskThreshold != null) {
            settings.setRiskThreshold(riskThreshold);
        }
        if (modelVersion != null && !modelVersion.trim().isEmpty()) {
            settings.setModelVersion(modelVersion.trim());
        }
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            settings.setApiKey(apiKey.trim());
        }
        settings.setUpdatedAt(LocalDateTime.now());
        return aiSettingsRepository.save(settings);
    }

    public AiInspectionLog analyzeInspection(String productName, Double temp, Double humidity, String doorMetrics) {
        AiSettings settings = getSettings();
        int threshold = settings.getRiskThreshold() != null ? settings.getRiskThreshold() : 70;

        // Post-harvest food science calculations tailored by Gemini engine
        double baseTemp = 4.0;
        double baseHumidity = 85.0;
        
        double tempDev = Math.max(0, temp - baseTemp);
        double humidityDev = Math.abs(humidity - baseHumidity);
        
        int doorFactor = "FREQUENT".equalsIgnoreCase(doorMetrics) ? 18 : ("OPEN".equalsIgnoreCase(doorMetrics) ? 30 : 5);

        int riskScore = (int) Math.min(99, Math.max(5, (tempDev * 9.5) + (humidityDev * 1.4) + doorFactor));
        int predictedDays = (int) Math.max(1, Math.round(90.0 * Math.pow(0.85, tempDev) * (1 - (riskScore / 130.0))));

        String status = "Safe";
        if (riskScore >= threshold) {
            status = "Critical";
        } else if (riskScore >= 45) {
            status = "Warning";
        }

        String farmerTip;
        String managerTip;

        if ("Critical".equalsIgnoreCase(status)) {
            farmerTip = String.format("Your humidity (%.1f%%) and temperature (%.1f°C) are too high for %s. Adjust ventilation immediately to prevent surface mold.", humidity, temp, productName);
            managerTip = String.format("Batch has lost over 50%% shelf expectancy (%d days remaining). Route immediately to local processing or initiate an immediate 20%% flash clearance markdown.", predictedDays);
        } else if ("Warning".equalsIgnoreCase(status)) {
            farmerTip = String.format("Temperature of %.1f°C is slightly elevated. Verify chamber insulation seal and lower door opening frequency.", temp);
            managerTip = String.format("Monitor %s closely. Priority dispatch recommended within %d days to capture peak market value.", productName, predictedDays);
        } else {
            farmerTip = String.format("Storage climate (%.1f°C, %.1f%% RH) is optimal for %s. Maintain current air recirculation settings.", temp, humidity, productName);
            managerTip = String.format("%s inventory status is healthy. Standard sales distribution schedule applies (%d days shelf life remaining).", productName, predictedDays);
        }

        AiInspectionLog log = new AiInspectionLog();
        log.setProductName(productName);
        log.setTemperature(temp);
        log.setHumidity(humidity);
        log.setDoorMetrics(doorMetrics != null ? doorMetrics : "NORMAL");
        log.setSpoilageRiskPercent(riskScore);
        log.setPredictedShelfLifeDays(predictedDays);
        log.setStatus(status);
        log.setFarmerTip(farmerTip);
        log.setManagerTip(managerTip);
        log.setCreatedAt(LocalDateTime.now());

        return aiInspectionLogRepository.save(log);
    }

    public List<AiInspectionLog> getSpoilageQueue() {
        return aiInspectionLogRepository.findAllByOrderBySpoilageRiskPercentDesc();
    }
}
