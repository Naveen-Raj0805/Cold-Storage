package com.agrifreeze.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chambers")
public class Chamber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chamber_code", nullable = false)
    private String chamberCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "temp")
    private Double temp;

    @Column(name = "target_temp")
    private Double targetTemp;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "occupied")
    private Integer occupied;

    @Column(name = "humidity")
    private String humidity;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private String status;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storage_unit_id")
    private StorageUnit storageUnit;

    public Chamber() {
    }

    public Chamber(String chamberCode, String name, Double temp, Double targetTemp, Integer capacity,
                   Integer occupied, String humidity, String type, String status, StorageUnit storageUnit) {
        this.chamberCode = chamberCode;
        this.name = name;
        this.temp = temp;
        this.targetTemp = targetTemp;
        this.capacity = capacity;
        this.occupied = occupied;
        this.humidity = humidity;
        this.type = type;
        this.status = status;
        this.storageUnit = storageUnit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChamberCode() {
        return chamberCode;
    }

    public void setChamberCode(String chamberCode) {
        this.chamberCode = chamberCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getTemp() {
        return temp;
    }

    public void setTemp(Double temp) {
        this.temp = temp;
    }

    public Double getTargetTemp() {
        return targetTemp;
    }

    public void setTargetTemp(Double targetTemp) {
        this.targetTemp = targetTemp;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getOccupied() {
        return occupied;
    }

    public void setOccupied(Integer occupied) {
        this.occupied = occupied;
    }

    public String getHumidity() {
        return humidity;
    }

    public void setHumidity(String humidity) {
        this.humidity = humidity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public StorageUnit getStorageUnit() {
        return storageUnit;
    }

    public void setStorageUnit(StorageUnit storageUnit) {
        this.storageUnit = storageUnit;
    }
}
