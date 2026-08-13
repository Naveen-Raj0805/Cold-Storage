package com.agrifreeze.controller;

import com.agrifreeze.entity.AlertNotification;
import com.agrifreeze.service.AlertNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AlertController {

    private final AlertNotificationService service;

    public AlertController(AlertNotificationService service) {
        this.service = service;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertNotification>> getAlerts() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<AlertNotification>> getNotifications(@RequestParam(required = false) String role) {
        if (role != null && !role.isBlank()) {
            return ResponseEntity.ok(service.getByRole(role));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/notifications")
    public ResponseEntity<AlertNotification> createNotification(@RequestBody AlertNotification alert) {
        return ResponseEntity.ok(service.save(alert));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<AlertNotification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(service.markAsRead(id));
    }
}
