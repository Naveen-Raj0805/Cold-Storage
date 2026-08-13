package com.agrifreeze.nosql.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "sensor_telemetries")
public class SensorTelemetryDoc {

    @Id
    private String id;
    private String storageId;
    private String storageName;
    private String chamberName;
    private Double temperature;
    private Double humidity;
    private String doorStatus;
    private String sensorRawData;
    private LocalDateTime timestamp;

    public SensorTelemetryDoc() {
        this.timestamp = LocalDateTime.now();
    }

    public SensorTelemetryDoc(String storageId, String storageName, String chamberName, Double temperature, Double humidity, String doorStatus, String sensorRawData) {
        this.storageId = storageId;
        this.storageName = storageName;
        this.chamberName = chamberName;
        this.temperature = temperature;
        this.humidity = humidity;
        this.doorStatus = doorStatus;
        this.sensorRawData = sensorRawData;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStorageId() { return storageId; }
    public void setStorageId(String storageId) { this.storageId = storageId; }

    public String getStorageName() { return storageName; }
    public void setStorageName(String storageName) { this.storageName = storageName; }

    public String getChamberName() { return chamberName; }
    public void setChamberName(String chamberName) { this.chamberName = chamberName; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public String getDoorStatus() { return doorStatus; }
    public void setDoorStatus(String doorStatus) { this.doorStatus = doorStatus; }

    public String getSensorRawData() { return sensorRawData; }
    public void setSensorRawData(String sensorRawData) { this.sensorRawData = sensorRawData; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
