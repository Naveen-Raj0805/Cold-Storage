package com.agrifreeze.nosql.repository;

import com.agrifreeze.nosql.entity.SensorTelemetryDoc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorTelemetryMongoRepository extends MongoRepository<SensorTelemetryDoc, String> {
    List<SensorTelemetryDoc> findByStorageId(String storageId);
}
