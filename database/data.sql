-- MySQL Initial Seed Data for AgriFreeze (agrifreeze_db)

USE agrifreeze_db;

-- 1. Initial Users (BCrypt encoded passwords for 'password')
INSERT INTO app_users (full_name, email, password, phone, role, status, created_at)
VALUES
('Sarah Jenkins', 'admin@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 019-2834', 'ADMIN', 'ACTIVE', NOW()),
('Robert Vance', 'manager@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 043-9821', 'MANAGER', 'ACTIVE', NOW()),
('Sanjay Patel', 'farmer@gmail.com', '$2a$10$e7WqJzW0p1bT/02Qx7t/8.wJ/E83G.2w.h4H21a.q/Y1Y6R5xJ61W', '+1 (555) 089-4512', 'FARMER', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE email=email;

-- 2. Initial Storage Units
INSERT INTO storage_units (name, capacity, occupied, location, manager, status, temp, humidity, door, power, efficiency, created_at)
VALUES
('AgriFreeze North Hub', 5000, 3800, 'Chicago, IL', 'Robert Vance', 'Active', 4.2, 85.0, 'CLOSED', 'GRID', 92, NOW()),
('AgriFreeze West Hub', 8000, 4500, 'Sacramento, CA', 'Alice Smith', 'Active', 3.5, 90.0, 'CLOSED', 'SOLAR', 95, NOW()),
('AgriFreeze South Facility', 6000, 0, 'Austin, TX', 'David Johnson', 'Inactive', 24.0, 50.0, 'OPEN', 'OFFLINE', 0, NOW())
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
INSERT INTO products (name, type, farmer_id, farmer_name, storage_id, storage_name, quantity, entry_date, shelf_life, spoilage_risk, status, created_at)
VALUES
('Organic Honeycrisp Apples', 'Fruits', 3, 'Sanjay Patel', 1, 'AgriFreeze North Hub', 800.0, '2026-06-15', 90, 'Low', 'Active', NOW()),
('Russet Baking Potatoes', 'Vegetables', 3, 'Sanjay Patel', 1, 'AgriFreeze North Hub', 1000.0, '2026-06-20', 120, 'Medium', 'Warning', NOW());

-- 5. Initial Bookings
INSERT INTO storage_bookings (booking_code, farmer_id, farmer_name, storage_id, storage_name, chamber_id, chamber_name, category, weight, start_date, end_date, price, status)
VALUES
('B-001', '3', 'Sanjay Patel', 'ST-001', 'AgriFreeze North Hub', 'CH-101', 'Chamber A (Fruits)', 'Fruits', '5,000 kg', '2026-07-10', '2026-10-10', '$1,200', 'Approved'),
('B-002', '3', 'Sanjay Patel', 'ST-002', 'AgriFreeze West Hub', 'CH-201', 'Chamber Alpha (Produce)', 'Vegetables', '3,000 kg', '2026-07-15', '2026-09-15', '$900', 'Pending');

-- 6. Initial Alerts
INSERT INTO alert_notifications (item_code, title, source, message, type, severity, role, status, is_read, created_at)
VALUES
('N-001', 'Temperature Normalised', 'Chamber C (Vegetables)', 'Chamber C temperature is back to safe levels (6.2°C).', 'Success', 'Info', 'manager', 'Resolved', FALSE, NOW()),
('N-002', 'New Storage Request', 'Farmer Sanjay Patel', 'Farmer Sanjay Patel has requested a slot for 3,000kg of Vegetables.', 'Info', 'Info', 'manager', 'Active', FALSE, NOW()),
('A-001', 'Chamber C Critical', 'Chamber C (Vegetables) - North Hub', 'Temperature elevated to 8.1°C. Target is 6.0°C.', 'Critical', 'Critical', 'manager', 'Active', FALSE, NOW());

-- 7. Initial AI System Settings (Master Prompt Governance)
INSERT INTO ai_settings (id, master_prompt, risk_threshold, model_version, updated_at)
VALUES (
    1,
    'You are AgriFreeze Food Science AI, an expert post-harvest agricultural safety and spoilage engine. Analyze temperature (°C), relative humidity (%), door opening frequency, and product type. Calculate predicted remaining shelf life in days, spoilage risk percentage (0-100%), and assign an overall status (Safe, Warning, Critical). Provide role-specific actionable insights: farmer_tip (immediate field/storage operations) and manager_tip (commercial dispatch or markdown action).',
    70,
    'gemini-2.5-flash',
    NOW()
)
ON DUPLICATE KEY UPDATE id=id;

-- 8. Initial AI Inspection Logs
INSERT INTO ai_inspection_logs (product_name, temperature, humidity, door_metrics, spoilage_risk_percent, predicted_shelf_life_days, status, farmer_tip, manager_tip, created_at)
VALUES
('Organic Honeycrisp Apples', 4.2, 85.0, '2 openings/day', 15, 84, 'Safe', 'Storage climate is optimal for apples. Maintain air recirculation to prevent ethylene buildup.', 'Inventory status healthy. Standard sales distribution schedule applies.', NOW()),
('Fresh Roma Tomatoes', 8.1, 95.0, '12 openings/day', 78, 4, 'Critical', 'Your humidity and temperature are too high for tomatoes. Adjust ventilation immediately to prevent surface mold.', 'Batch has lost 50% shelf expectancy. Route immediately to local processing or initiate an immediate 20% flash clearance markdown.', NOW());
