package com.agrifreeze.nosql.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_inspection_docs")
public class AiInspectionDoc {

    @Id
    private String id;
    private String productName;
    private String farmerName;
    private String storageName;
    private String chamberName;
    private Double temperature;
    private Double humidity;
    private Integer spoilageRiskPercent;
    private Integer predictedShelfLifeDays;
    private String status;
    private String farmerTip;
    private String managerTip;
    private String aiAnalysisRawJson;
    private LocalDateTime createdAt;

    public AiInspectionDoc() {
        this.createdAt = LocalDateTime.now();
    }

    public AiInspectionDoc(String productName, String farmerName, String storageName, String chamberName, Double temperature, Double humidity, Integer spoilageRiskPercent, Integer predictedShelfLifeDays, String status, String farmerTip, String managerTip) {
        this.productName = productName;
        this.farmerName = farmerName;
        this.storageName = storageName;
        this.chamberName = chamberName;
        this.temperature = temperature;
        this.humidity = humidity;
        this.spoilageRiskPercent = spoilageRiskPercent;
        this.predictedShelfLifeDays = predictedShelfLifeDays;
        this.status = status;
        this.farmerTip = farmerTip;
        this.managerTip = managerTip;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getStorageName() { return storageName; }
    public void setStorageName(String storageName) { this.storageName = storageName; }

    public String getChamberName() { return chamberName; }
    public void setChamberName(String chamberName) { this.chamberName = chamberName; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Integer getSpoilageRiskPercent() { return spoilageRiskPercent; }
    public void setSpoilageRiskPercent(Integer spoilageRiskPercent) { this.spoilageRiskPercent = spoilageRiskPercent; }

    public Integer getPredictedShelfLifeDays() { return predictedShelfLifeDays; }
    public void setPredictedShelfLifeDays(Integer predictedShelfLifeDays) { this.predictedShelfLifeDays = predictedShelfLifeDays; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFarmerTip() { return farmerTip; }
    public void setFarmerTip(String farmerTip) { this.farmerTip = farmerTip; }

    public String getManagerTip() { return managerTip; }
    public void setManagerTip(String managerTip) { this.managerTip = managerTip; }

    public String getAiAnalysisRawJson() { return aiAnalysisRawJson; }
    public void setAiAnalysisRawJson(String aiAnalysisRawJson) { this.aiAnalysisRawJson = aiAnalysisRawJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
