package com.agrifreeze.repository;

import com.agrifreeze.entity.Chamber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChamberRepository extends JpaRepository<Chamber, Long> {
    List<Chamber> findByStorageUnitId(Long storageUnitId);
    List<Chamber> findByStorageUnitIdAndStatusIgnoreCase(Long storageUnitId, String status);
}
