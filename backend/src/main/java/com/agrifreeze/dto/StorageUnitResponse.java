package com.agrifreeze.dto;

import java.time.LocalDateTime;

public class StorageUnitResponse {

    private Long id;
    private String name;
    private Integer capacity;
    private Integer occupied;
    private String location;
    private String manager;
    private String status;
    private Double temp;
    private Double humidity;
    private String door;
    private String power;
    private Integer efficiency;
    private LocalDateTime createdAt;

    public StorageUnitResponse() {
    }

    public StorageUnitResponse(Long id, String name, Integer capacity, Integer occupied, String location,
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
