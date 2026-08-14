package com.agrifreeze.controller;

import com.agrifreeze.entity.AiInspectionLog;
import com.agrifreeze.entity.AiSettings;
import com.agrifreeze.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/settings")
    public ResponseEntity<AiSettings> getSettings() {
        return ResponseEntity.ok(aiService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<AiSettings> updateSettings(@RequestBody Map<String, Object> body) {
        String masterPrompt = (String) body.get("masterPrompt");
        Integer riskThreshold = body.get("riskThreshold") != null ? Integer.parseInt(body.get("riskThreshold").toString()) : null;
        String modelVersion = (String) body.get("modelVersion");
        String apiKey = (String) body.get("apiKey");

        AiSettings updated = aiService.updateSettings(masterPrompt, riskThreshold, modelVersion, apiKey);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/analyze-inspection")
    public ResponseEntity<AiInspectionLog> analyzeInspection(@RequestBody Map<String, Object> payload) {
        String productName = payload.get("productName") != null ? payload.get("productName").toString() : "Crop Harvest Batch";
        Double temperature = payload.get("temperature") != null ? Double.parseDouble(payload.get("temperature").toString()) : 4.0;
        Double humidity = payload.get("humidity") != null ? Double.parseDouble(payload.get("humidity").toString()) : 85.0;
        String doorMetrics = payload.get("doorMetrics") != null ? payload.get("doorMetrics").toString() : "NORMAL";

        AiInspectionLog result = aiService.analyzeInspection(productName, temperature, humidity, doorMetrics);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/spoilage-queue")
    public ResponseEntity<List<AiInspectionLog>> getSpoilageQueue() {
        return ResponseEntity.ok(aiService.getSpoilageQueue());
    }
}
