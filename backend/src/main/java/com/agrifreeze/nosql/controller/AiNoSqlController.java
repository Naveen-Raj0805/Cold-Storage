package com.agrifreeze.nosql.controller;

import com.agrifreeze.nosql.entity.AiInspectionDoc;
import com.agrifreeze.nosql.repository.AiInspectionMongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nosql/ai")
public class AiNoSqlController {

    private final AiInspectionMongoRepository mongoRepository;

    public AiNoSqlController(AiInspectionMongoRepository mongoRepository) {
        this.mongoRepository = mongoRepository;
    }

    @PostMapping("/inspection")
    public ResponseEntity<AiInspectionDoc> saveAiInspectionDoc(@RequestBody AiInspectionDoc doc) {
        if (doc.getProductName() == null) doc.setProductName("Roma Tomatoes");
        AiInspectionDoc saved = mongoRepository.save(doc);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/inspections")
    public ResponseEntity<List<AiInspectionDoc>> getAllAiInspections() {
        return ResponseEntity.ok(mongoRepository.findAll());
    }
}
