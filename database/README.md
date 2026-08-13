# AgriFreeze MySQL Database Scripts

This dedicated directory contains all MySQL database scripts for the AgriFreeze Food Storage System.

---

## Directory Contents

- [`schema.sql`](file:///c:/Users/Naveen%20Raj/Downloads/Food_Storage/database/schema.sql): DDL Script creating the database `agrifreeze_db` and all 6 tables (`app_users`, `storage_units`, `chambers`, `products`, `storage_bookings`, `alert_notifications`).
- [`data.sql`](file:///c:/Users/Naveen%20Raj/Downloads/Food_Storage/database/data.sql): DML Script seeding initial data for users, storage hubs, chambers, products, bookings, and alerts.

---

## How to Import Scripts into MySQL

### Using MySQL Command Line Client:
```bash
mysql -u root -p < "c:\Users\Naveen Raj\Downloads\Food_Storage\database\schema.sql"
mysql -u root -p < "c:\Users\Naveen Raj\Downloads\Food_Storage\database\data.sql"
```

### Using MySQL Workbench:
1. Open MySQL Workbench and connect to your MySQL Server instance (`localhost:3306`).
2. Go to **File -> Open SQL Script** and select `database/schema.sql`.
3. Click the **Execute (Lightning icon)** button to run the script.
4. Repeat for `database/data.sql`.
