package com.agrifreeze.nosql.controller;

import com.agrifreeze.entity.AiInspectionLog;
import com.agrifreeze.nosql.entity.AiInspectionDoc;
import com.agrifreeze.nosql.repository.AiInspectionMongoRepository;
import com.agrifreeze.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nosql/ai")
public class AiNoSqlController {

    private final AiInspectionMongoRepository mongoRepository;
    private final AiService aiService;

    public AiNoSqlController(AiInspectionMongoRepository mongoRepository, AiService aiService) {
        this.mongoRepository = mongoRepository;
        this.aiService = aiService;
    }

    @PostMapping("/inspection")
    public ResponseEntity<AiInspectionDoc> saveAiInspectionDoc(@RequestBody AiInspectionDoc doc) {
        if (doc.getProductName() == null) doc.setProductName("Roma Tomatoes");
        if (doc.getTemperature() == null) doc.setTemperature(4.0);
        if (doc.getHumidity() == null) doc.setHumidity(85.0);

        AiInspectionLog eval = aiService.analyzeInspection(
            doc.getProductName(),
            doc.getTemperature(),
            doc.getHumidity(),
            doc.getDoorMetrics()
        );

        doc.setSpoilageRiskPercent(eval.getSpoilageRiskPercent());
        doc.setPredictedShelfLifeDays(eval.getPredictedShelfLifeDays());
        doc.setStatus(eval.getStatus());
        doc.setFarmerTip(eval.getFarmerTip());
        doc.setManagerTip(eval.getManagerTip());

        AiInspectionDoc saved = mongoRepository.save(doc);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/inspections")
    public ResponseEntity<List<AiInspectionDoc>> getAllAiInspections() {
        return ResponseEntity.ok(mongoRepository.findAll());
    }
}
