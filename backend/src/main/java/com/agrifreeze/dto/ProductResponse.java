package com.agrifreeze.dto;

import com.agrifreeze.entity.Product;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String name;
    private String type;
    private Long farmerId;
    private String farmerName;
    private Long storageId;
    private String storageName;
    private Double quantity;
    private LocalDate entryDate;
    private Integer shelfLife;
    private String spoilageRisk;
    private String status;
    private LocalDateTime createdAt;

    public ProductResponse() {
    }

    public ProductResponse(Long id, String name, String type, Long farmerId, String farmerName, Long storageId, String storageName, Double quantity, LocalDate entryDate, Integer shelfLife, String spoilageRisk, String status, LocalDateTime createdAt) {
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
        this.createdAt = createdAt;
    }

    public ProductResponse(Product product) {
        if (product != null) {
            this.id = product.getId();
            this.name = product.getName();
            this.type = product.getType();
            this.farmerId = product.getFarmerId();
            this.farmerName = product.getFarmerName();
            this.storageId = product.getStorageId();
            this.storageName = product.getStorageName();
            this.quantity = product.getQuantity();
            this.entryDate = product.getEntryDate();
            this.shelfLife = product.getShelfLife();
            this.spoilageRisk = product.getSpoilageRisk();
            this.status = product.getStatus();
            this.createdAt = product.getCreatedAt();
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
