package com.agrifreeze.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_settings")
public class AiSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "master_prompt", columnDefinition = "TEXT")
    private String masterPrompt;

    @Column(name = "risk_threshold")
    private Integer riskThreshold = 70;

    @Column(name = "model_version", length = 100)
    private String modelVersion = "gemini-2.5-flash";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AiSettings() {}

    public AiSettings(String masterPrompt, Integer riskThreshold, String modelVersion) {
        this.masterPrompt = masterPrompt;
        this.riskThreshold = riskThreshold;
        this.modelVersion = modelVersion;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMasterPrompt() { return masterPrompt; }
    public void setMasterPrompt(String masterPrompt) { this.masterPrompt = masterPrompt; }

    public Integer getRiskThreshold() { return riskThreshold; }
    public void setRiskThreshold(Integer riskThreshold) { this.riskThreshold = riskThreshold; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
