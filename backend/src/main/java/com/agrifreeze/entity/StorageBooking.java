package com.agrifreeze.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "storage_bookings")
public class StorageBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code")
    private String bookingCode;

    @Column(name = "farmer_id")
    private String farmerId;

    @Column(name = "farmer_name")
    private String farmerName;

    @Column(name = "storage_id")
    private String storageId;

    @Column(name = "storage_name")
    private String storageName;

    @Column(name = "chamber_id")
    private String chamberId;

    @Column(name = "chamber_name")
    private String chamberName;

    @Column(name = "category")
    private String category;

    @Column(name = "weight")
    private String weight;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "price")
    private String price;

    @Column(name = "status")
    private String status;

    public StorageBooking() {
    }

    public StorageBooking(String bookingCode, String farmerId, String farmerName, String storageId,
                          String storageName, String chamberId, String chamberName, String category,
                          String weight, LocalDate startDate, LocalDate endDate, String price, String status) {
        this.bookingCode = bookingCode;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
        this.storageId = storageId;
        this.storageName = storageName;
        this.chamberId = chamberId;
        this.chamberName = chamberName;
        this.category = category;
        this.weight = weight;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = price;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getStorageId() {
        return storageId;
    }

    public void setStorageId(String storageId) {
        this.storageId = storageId;
    }

    public String getStorageName() {
        return storageName;
    }

    public void setStorageName(String storageName) {
        this.storageName = storageName;
    }

    public String getChamberId() {
        return chamberId;
    }

    public void setChamberId(String chamberId) {
        this.chamberId = chamberId;
    }

    public String getChamberName() {
        return chamberName;
    }

    public void setChamberName(String chamberName) {
        this.chamberName = chamberName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
