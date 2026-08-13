package com.agrifreeze.repository;

import com.agrifreeze.entity.AiInspectionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiInspectionLogRepository extends JpaRepository<AiInspectionLog, Long> {
    List<AiInspectionLog> findAllByOrderBySpoilageRiskPercentDesc();
}
