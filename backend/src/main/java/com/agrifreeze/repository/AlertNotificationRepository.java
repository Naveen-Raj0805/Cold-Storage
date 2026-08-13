package com.agrifreeze.repository;

import com.agrifreeze.entity.AlertNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {
    List<AlertNotification> findByRole(String role);
    List<AlertNotification> findBySeverity(String severity);
    List<AlertNotification> findByStatus(String status);
}
