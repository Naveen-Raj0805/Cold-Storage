-- MySQL Initial Seed Data for AgriFreeze (agrifreeze_db)

USE agrifreeze_db;

-- 1. Initial Users (BCrypt encoded passwords for 'password')
INSERT INTO app_users (full_name, email, password, phone, role, status)
VALUES
('Sarah Jenkins', 'admin@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 019-2834', 'ADMIN', 'ACTIVE'),
('Robert Vance', 'manager@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 043-9821', 'MANAGER', 'ACTIVE'),
('Sanjay Patel', 'farmer@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 089-4512', 'FARMER', 'ACTIVE')
ON DUPLICATE KEY UPDATE email=email;

-- 2. Initial Storage Units
INSERT INTO storage_units (name, capacity, occupied, location, manager, status, temp, humidity, door, power, efficiency)
VALUES
('AgriFreeze North Hub', 5000, 3800, 'Chicago, IL', 'Robert Vance', 'Active', 4.2, 85.0, 'CLOSED', 'GRID', 92),
('AgriFreeze West Hub', 8000, 4500, 'Sacramento, CA', 'Alice Smith', 'Active', 3.5, 90.0, 'CLOSED', 'SOLAR', 95),
('AgriFreeze South Facility', 6000, 0, 'Austin, TX', 'David Johnson', 'Inactive', 24.0, 50.0, 'OPEN', 'OFFLINE', 0)
ON DUPLICATE KEY UPDATE name=name;

-- 3. Initial Chambers
INSERT INTO chambers (chamber_code, name, temp, target_temp, capacity, occupied, humidity, type, status, storage_unit_id)
VALUES
('CH-101', 'Chamber A (Fruits)', 4.2, 4.0, 2000, 1800, '90%', 'Cold Storage', 'Active', 1),
('CH-102', 'Chamber B (Deep Freeze)', -18.5, -18.0, 1500, 1200, '75%', 'Freezer', 'Active', 1),
('CH-103', 'Chamber C (Vegetables)', 8.1, 6.0, 1500, 800, '95%', 'Chilled Storage', 'Warning', 1),
('CH-201', 'Chamber Alpha (Produce)', 3.5, 3.0, 4000, 3000, '92%', 'Cold Storage', 'Active', 2),
('CH-202', 'Chamber Beta (Dairy/Meat)', -22.0, -20.0, 4000, 1500, '70%', 'Freezer', 'Active', 2);

-- 4. Initial Products
INSERT INTO products (name, type, farmer_id, farmer_name, storage_id, storage_name, quantity, entry_date, shelf_life, spoilage_risk, status)
VALUES
('Organic Honeycrisp Apples', 'Fruits', 3, 'Sanjay Patel', 1, 'AgriFreeze North Hub', 800.0, '2026-06-15', 90, 'Low', 'Active'),
('Russet Baking Potatoes', 'Vegetables', 3, 'Sanjay Patel', 1, 'AgriFreeze North Hub', 1000.0, '2026-06-20', 120, 'Medium', 'Warning');

-- 5. Initial Bookings
INSERT INTO storage_bookings (booking_code, farmer_id, farmer_name, storage_id, storage_name, chamber_id, chamber_name, category, weight, start_date, end_date, price, status)
VALUES
('B-001', '3', 'Sanjay Patel', 'ST-001', 'AgriFreeze North Hub', 'CH-101', 'Chamber A (Fruits)', 'Fruits', '5,000 kg', '2026-07-10', '2026-10-10', '$1,200', 'Approved'),
('B-002', '3', 'Sanjay Patel', 'ST-002', 'AgriFreeze West Hub', 'CH-201', 'Chamber Alpha (Produce)', 'Vegetables', '3,000 kg', '2026-07-15', '2026-09-15', '$900', 'Pending');

-- 6. Initial Alerts
INSERT INTO alert_notifications (item_code, title, source, message, type, severity, role, status, is_read)
VALUES
('N-001', 'Temperature Normalised', 'Chamber C (Vegetables)', 'Chamber C temperature is back to safe levels (6.2°C).', 'Success', 'Info', 'manager', 'Resolved', FALSE),
('N-002', 'New Storage Request', 'Farmer Sanjay Patel', 'Farmer Sanjay Patel has requested a slot for 3,000kg of Vegetables.', 'Info', 'Info', 'manager', 'Active', FALSE),
('A-001', 'Chamber C Critical', 'Chamber C (Vegetables) - North Hub', 'Temperature elevated to 8.1°C. Target is 6.0°C.', 'Critical', 'Critical', 'manager', 'Active', FALSE);
