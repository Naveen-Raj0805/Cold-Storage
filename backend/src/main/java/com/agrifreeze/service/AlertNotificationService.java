package com.agrifreeze.service;

import com.agrifreeze.entity.AlertNotification;
import com.agrifreeze.repository.AlertNotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertNotificationService {

    private final AlertNotificationRepository repository;

    public AlertNotificationService(AlertNotificationRepository repository) {
        this.repository = repository;
    }

    public List<AlertNotification> getAll() {
        return repository.findAll();
    }

    public List<AlertNotification> getByRole(String role) {
        return repository.findByRole(role);
    }

    public List<AlertNotification> getBySeverity(String severity) {
        return repository.findBySeverity(severity);
    }

    public AlertNotification save(AlertNotification alert) {
        return repository.save(alert);
    }

    public AlertNotification markAsRead(Long id) {
        AlertNotification item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        item.setIsRead(true);
        return repository.save(item);
    }

    public AlertNotification updateStatus(Long id, String status) {
        AlertNotification item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        item.setStatus(status);
        return repository.save(item);
    }
}
