package com.agrifreeze.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type")
    private String type;

    @NotNull(message = "Farmer ID is required")
    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    @Column(name = "farmer_name")
    private String farmerName;

    @Column(name = "storage_id")
    private Long storageId;

    @Column(name = "storage_name")
    private String storageName;

    @NotNull(message = "Quantity is required")
    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "shelf_life")
    private Integer shelfLife;

    @Column(name = "spoilage_risk")
    private String spoilageRisk;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Product() {
    }

    public Product(Long id, String name, String type, Long farmerId, String farmerName, Long storageId, String storageName, Double quantity, LocalDate entryDate, Integer shelfLife, String spoilageRisk, String status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
        this.storageId = storageId;
        this.storageName = storageName;
        this.quantity = quantity;
        this.entryDate = entryDate;
        this.shelfLife = shelfLife;
        this.spoilageRisk = spoilageRisk;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.entryDate == null) {
            this.entryDate = LocalDate.now();
        }
        if (this.spoilageRisk == null || this.spoilageRisk.isBlank()) {
            this.spoilageRisk = "Low";
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "Pending";
        }
        if (this.quantity == null) {
            this.quantity = 0.0;
        }
        if (this.shelfLife == null) {
            this.shelfLife = 14;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public Long getStorageId() {
        return storageId;
    }

    public void setStorageId(Long storageId) {
        this.storageId = storageId;
    }

    public String getStorageName() {
        return storageName;
    }

    public void setStorageName(String storageName) {
        this.storageName = storageName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public Integer getShelfLife() {
        return shelfLife;
    }

    public void setShelfLife(Integer shelfLife) {
        this.shelfLife = shelfLife;
    }

    public String getSpoilageRisk() {
        return spoilageRisk;
    }

    public void setSpoilageRisk(String spoilageRisk) {
        this.spoilageRisk = spoilageRisk;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
