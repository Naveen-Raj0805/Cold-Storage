package com.agrifreeze.dto;

public class StorageUnitRequest {

    private String name;
    private Integer capacity;
    private String location;
    private String manager;
    private String status;
    private Double temp;
    private Double humidity;
    private String door;
    private String power;
    private Integer efficiency;
    private Integer chamberCount;

    public StorageUnitRequest() {
    }

    public StorageUnitRequest(String name, Integer capacity, String location, String manager,
                              String status, Double temp, Double humidity, String door,
                              String power, Integer efficiency) {
        this.name = name;
        this.capacity = capacity;
        this.location = location;
        this.manager = manager;
        this.status = status;
        this.temp = temp;
        this.humidity = humidity;
        this.door = door;
        this.power = power;
        this.efficiency = efficiency;
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

    public Integer getChamberCount() {
        return chamberCount;
    }

    public void setChamberCount(Integer chamberCount) {
        this.chamberCount = chamberCount;
    }
}
