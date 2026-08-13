package com.agrifreeze.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product type is required")
    private String type;

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    private String farmerName;

    @NotNull(message = "Storage ID is required")
    private Long storageId;

    private String storageName;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    private LocalDate entryDate;

    @PositiveOrZero(message = "Shelf life cannot be negative")
    private Integer shelfLife;

    private String spoilageRisk;

    private String status;

    public ProductRequest() {
    }

    public ProductRequest(String name, String type, Long farmerId, String farmerName, Long storageId, String storageName, Double quantity, LocalDate entryDate, Integer shelfLife, String spoilageRisk, String status) {
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
}
