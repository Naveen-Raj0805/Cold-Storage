package com.agrifreeze.nosql.controller;

import com.agrifreeze.nosql.entity.SensorTelemetryDoc;
import com.agrifreeze.nosql.repository.SensorTelemetryMongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nosql/telemetry")
public class TelemetryNoSqlController {

    private final SensorTelemetryMongoRepository mongoRepository;

    public TelemetryNoSqlController(SensorTelemetryMongoRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    @PostMapping
    public ResponseEntity<SensorTelemetryDoc> saveTelemetry(@RequestBody SensorTelemetryDoc doc) {
        if (doc.getStorageId() == null) doc.setStorageId("ST-001");
        SensorTelemetryDoc saved = mongoRepository.save(doc);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<SensorTelemetryDoc>> getAllTelemetries() {
        return ResponseEntity.ok(mongoRepository.findAll());
    }

    @GetMapping("/storage/{storageId}")
    public ResponseEntity<List<SensorTelemetryDoc>> getTelemetriesByStorage(@PathVariable String storageId) {
        return ResponseEntity.ok(mongoRepository.findByStorageId(storageId));
    }
}
