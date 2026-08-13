package com.agrifreeze.nosql.repository;

import com.agrifreeze.nosql.entity.AiInspectionDoc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiInspectionMongoRepository extends MongoRepository<AiInspectionDoc, String> {
    List<AiInspectionDoc> findByProductNameContainingIgnoreCase(String productName);
}
