package com.agrifreeze.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert_notifications")
public class AlertNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_code")
    private String itemCode;

    @Column(name = "title")
    private String title;

    @Column(name = "source")
    private String source;

    @Column(name = "message", length = 1000)
    private String message;

    @Column(name = "type")
    private String type; // Info, Success, Warning, Critical

    @Column(name = "severity")
    private String severity; // Critical, Warning, Info

    @Column(name = "role")
    private String role; // manager, farmer, admin

    @Column(name = "status")
    private String status; // Active, Resolved

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AlertNotification() {
    }

    public AlertNotification(String itemCode, String title, String source, String message,
                             String type, String severity, String role, String status, Boolean isRead) {
        this.itemCode = itemCode;
        this.title = title;
        this.source = source;
        this.message = message;
        this.type = type;
        this.severity = severity;
        this.role = role;
        this.status = status;
        this.isRead = isRead != null ? isRead : false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
