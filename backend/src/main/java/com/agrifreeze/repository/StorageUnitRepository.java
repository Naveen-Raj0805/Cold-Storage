package com.agrifreeze.repository;

import com.agrifreeze.entity.StorageUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorageUnitRepository extends JpaRepository<StorageUnit, Long> {

    Optional<StorageUnit> findByName(String name);

    boolean existsByName(String name);
}
