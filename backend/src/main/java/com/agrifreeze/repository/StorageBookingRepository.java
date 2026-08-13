package com.agrifreeze.repository;

import com.agrifreeze.entity.StorageBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StorageBookingRepository extends JpaRepository<StorageBooking, Long> {
    List<StorageBooking> findByFarmerId(String farmerId);
    List<StorageBooking> findByStorageId(String storageId);
    List<StorageBooking> findByStatus(String status);
    List<StorageBooking> findByFarmerIdAndStatusIgnoreCase(String farmerId, String status);
    List<StorageBooking> findByFarmerIdAndStorageIdAndChamberIdAndStatusIgnoreCase(String farmerId, String storageId, String chamberId, String status);
}
