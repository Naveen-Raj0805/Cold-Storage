-- MySQL Database Schema Definition for AgriFreeze Food Storage System
-- Database Name: agrifreeze_db

CREATE DATABASE IF NOT EXISTS agrifreeze_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrifreeze_db;

-- 1. App Users Table
CREATE TABLE IF NOT EXISTS app_users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'FARMER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Storage Units Table
CREATE TABLE IF NOT EXISTS storage_units (
    storage_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    occupied INT DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    manager VARCHAR(255) DEFAULT 'Unassigned',
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    temp DOUBLE PRECISION DEFAULT 4.0,
    humidity DOUBLE PRECISION DEFAULT 80.0,
    door VARCHAR(50) DEFAULT 'CLOSED',
    power VARCHAR(50) DEFAULT 'GRID',
    efficiency INT DEFAULT 90,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Chambers Table
CREATE TABLE IF NOT EXISTS chambers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chamber_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    temp DOUBLE PRECISION,
    target_temp DOUBLE PRECISION,
    capacity INT,
    occupied INT,
    humidity VARCHAR(50),
    type VARCHAR(100),
    status VARCHAR(50),
    storage_unit_id BIGINT,
    FOREIGN KEY (storage_unit_id) REFERENCES storage_units(storage_id) ON DELETE CASCADE
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    farmer_id BIGINT NOT NULL,
    farmer_name VARCHAR(255),
    storage_id BIGINT,
    storage_name VARCHAR(255),
    quantity DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    entry_date DATE,
    shelf_life INT DEFAULT 14,
    spoilage_risk VARCHAR(50) DEFAULT 'Low',
    status VARCHAR(50) DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES app_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (storage_id) REFERENCES storage_units(storage_id) ON DELETE SET NULL
);

-- 5. Storage Bookings Table
CREATE TABLE IF NOT EXISTS storage_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(100),
    farmer_id VARCHAR(100),
    farmer_name VARCHAR(255),
    storage_id VARCHAR(100),
    storage_name VARCHAR(255),
    chamber_id VARCHAR(100),
    chamber_name VARCHAR(255),
    category VARCHAR(100),
    weight VARCHAR(100),
    start_date DATE,
    end_date DATE,
    price VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 6. Alert & Notifications Table
CREATE TABLE IF NOT EXISTS alert_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(100),
    title VARCHAR(255),
    source VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    severity VARCHAR(50),
    role VARCHAR(50),
    status VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI System Settings Table (MySQL Master Prompt & Config Governance)
CREATE TABLE IF NOT EXISTS ai_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    master_prompt TEXT NOT NULL,
    risk_threshold INT DEFAULT 70,
    model_version VARCHAR(100) DEFAULT 'gemini-2.5-flash',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. AI Inspection Logs Table (MongoDB / MySQL Telemetry Records)
CREATE TABLE IF NOT EXISTS ai_inspection_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    humidity DOUBLE PRECISION NOT NULL,
    door_metrics VARCHAR(100) DEFAULT 'NORMAL',
    spoilage_risk_percent INT NOT NULL,
    predicted_shelf_life_days INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    farmer_tip TEXT,
    manager_tip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
