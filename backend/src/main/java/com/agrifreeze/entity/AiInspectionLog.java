package com.agrifreeze.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_inspection_logs")
public class AiInspectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "temperature", nullable = false)
    private Double temperature;

    @Column(name = "humidity", nullable = false)
    private Double humidity;

    @Column(name = "door_metrics")
    private String doorMetrics = "NORMAL";

    @Column(name = "spoilage_risk_percent", nullable = false)
    private Integer spoilageRiskPercent;

    @Column(name = "predicted_shelf_life_days", nullable = false)
    private Integer predictedShelfLifeDays;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "farmer_tip", columnDefinition = "TEXT")
    private String farmerTip;

    @Column(name = "manager_tip", columnDefinition = "TEXT")
    private String managerTip;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AiInspectionLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public String getDoorMetrics() { return doorMetrics; }
    public void setDoorMetrics(String doorMetrics) { this.doorMetrics = doorMetrics; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
