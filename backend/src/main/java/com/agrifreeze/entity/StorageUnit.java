package com.agrifreeze.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "storage_units")
public class StorageUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storage_id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "occupied")
    private Integer occupied;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "manager")
    private String manager;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "temp")
    private Double temp;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "door")
    private String door;

    @Column(name = "power")
    private String power;

    @Column(name = "efficiency")
    private Integer efficiency;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public StorageUnit() {
    }

    public StorageUnit(Long id, String name, Integer capacity, Integer occupied, String location,
                       String manager, String status, Double temp, Double humidity, String door,
                       String power, Integer efficiency, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.occupied = occupied;
        this.location = location;
        this.manager = manager;
        this.status = status;
        this.temp = temp;
        this.humidity = humidity;
        this.door = door;
        this.power = power;
        this.efficiency = efficiency;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "ACTIVE";
        }
        if (this.occupied == null) {
            this.occupied = 0;
        }
        if (this.temp == null) {
            this.temp = 4.0;
        }
        if (this.humidity == null) {
            this.humidity = 80.0;
        }
        if (this.door == null || this.door.isBlank()) {
            this.door = "CLOSED";
        }
        if (this.power == null || this.power.isBlank()) {
            this.power = "GRID";
        }
        if (this.efficiency == null) {
            this.efficiency = 90;
        }
        if (this.manager == null || this.manager.isBlank()) {
            this.manager = "Unassigned";
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTemp() {
        return temp;
    }

    public void setTemp(Double temp) {
        this.temp = temp;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public String getDoor() {
        return door;
    }

    public void setDoor(String door) {
        this.door = door;
    }

    public String getPower() {
        return power;
    }

    public void setPower(String power) {
        this.power = power;
    }

    public Integer getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(Integer efficiency) {
        this.efficiency = efficiency;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
