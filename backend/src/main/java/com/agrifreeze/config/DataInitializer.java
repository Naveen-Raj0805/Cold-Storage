package com.agrifreeze.config;

import com.agrifreeze.entity.*;
import com.agrifreeze.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final StorageUnitRepository storageUnitRepository;
    private final ChamberRepository chamberRepository;
    private final ProductRepository productRepository;
    private final StorageBookingRepository bookingRepository;
    private final AlertNotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AppUserRepository userRepository,
                           StorageUnitRepository storageUnitRepository,
                           ChamberRepository chamberRepository,
                           ProductRepository productRepository,
                           StorageBookingRepository bookingRepository,
                           AlertNotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.storageUnitRepository = storageUnitRepository;
        this.chamberRepository = chamberRepository;
        this.productRepository = productRepository;
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (storageUnitRepository.count() == 0) {
            seedStorageUnitsAndChambers();
        } else if (chamberRepository.count() == 0) {
            List<StorageUnit> storages = storageUnitRepository.findAll();
            if (!storages.isEmpty()) {
                StorageUnit st1 = storages.get(0);
                StorageUnit st2 = storages.size() > 1 ? storages.get(1) : st1;
                Chamber ch101 = new Chamber("CH-101", "Chamber A (Fruits)", 4.2, 4.0, 2000, 1800, "90%", "Cold Storage", "AVAILABLE", st1);
                Chamber ch102 = new Chamber("CH-102", "Chamber B (Deep Freeze)", -18.5, -18.0, 1500, 1200, "75%", "Freezer", "AVAILABLE", st1);
                Chamber ch103 = new Chamber("CH-103", "Chamber C (Vegetables)", 8.1, 6.0, 1500, 800, "95%", "Chilled Storage", "AVAILABLE", st1);

                Chamber ch201 = new Chamber("CH-201", "Chamber Alpha (Produce)", 3.5, 3.0, 4000, 3000, "92%", "Cold Storage", "AVAILABLE", st2);
                Chamber ch202 = new Chamber("CH-202", "Chamber Beta (Dairy/Meat)", -22.0, -20.0, 4000, 1500, "70%", "Freezer", "AVAILABLE", st2);

                chamberRepository.saveAll(List.of(ch101, ch102, ch103, ch201, ch202));
            }
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (bookingRepository.count() == 0) {
            seedBookings();
        }
        if (notificationRepository.count() == 0) {
            seedAlertsAndNotifications();
        }
    }

    private void seedUsers() {
        AppUser admin = new AppUser(null, "Sarah Jenkins", "admin@agrifreeze.com", passwordEncoder.encode("password"),
                "+1 (555) 019-2834", "ADMIN", "ACTIVE", null);

        AppUser manager = new AppUser(null, "Robert Vance", "manager@agrifreeze.com", passwordEncoder.encode("password"),
                "+1 (555) 043-9821", "MANAGER", "ACTIVE", null);

        AppUser farmer = new AppUser(null, "Sanjay Patel", "farmer@agrifreeze.com", passwordEncoder.encode("password"),
                "+1 (555) 089-4512", "FARMER", "ACTIVE", null);

        userRepository.saveAll(List.of(admin, manager, farmer));
    }

    private void seedStorageUnitsAndChambers() {
        StorageUnit st1 = new StorageUnit(null, "AgriFreeze North Hub", 5000, 3800, "Chicago, IL",
                "Robert Vance", "Active", 4.2, 85.0, "CLOSED", "GRID", 92, null);

        StorageUnit st2 = new StorageUnit(null, "AgriFreeze West Hub", 8000, 4500, "Sacramento, CA",
                "Alice Smith", "Active", 3.5, 90.0, "CLOSED", "SOLAR", 95, null);

        StorageUnit st3 = new StorageUnit(null, "AgriFreeze South Facility", 6000, 0, "Austin, TX",
                "David Johnson", "Inactive", 24.0, 50.0, "OPEN", "OFFLINE", 0, null);

        st1 = storageUnitRepository.save(st1);
        st2 = storageUnitRepository.save(st2);
        st3 = storageUnitRepository.save(st3);

        Chamber ch101 = new Chamber("CH-101", "Chamber A (Fruits)", 4.2, 4.0, 2000, 1800, "90%", "Cold Storage", "Active", st1);
        Chamber ch102 = new Chamber("CH-102", "Chamber B (Deep Freeze)", -18.5, -18.0, 1500, 1200, "75%", "Freezer", "Active", st1);
        Chamber ch103 = new Chamber("CH-103", "Chamber C (Vegetables)", 8.1, 6.0, 1500, 800, "95%", "Chilled Storage", "Warning", st1);

        Chamber ch201 = new Chamber("CH-201", "Chamber Alpha (Produce)", 3.5, 3.0, 4000, 3000, "92%", "Cold Storage", "Active", st2);
        Chamber ch202 = new Chamber("CH-202", "Chamber Beta (Dairy/Meat)", -22.0, -20.0, 4000, 1500, "70%", "Freezer", "Active", st2);

        chamberRepository.saveAll(List.of(ch101, ch102, ch103, ch201, ch202));
    }

    private void seedProducts() {
        Product p1 = new Product();
        p1.setName("Organic Honeycrisp Apples");
        p1.setType("Fruits");
        p1.setQuantity(800.0);
        p1.setStorageId(1L);
        p1.setStorageName("AgriFreeze North Hub");
        p1.setFarmerId(3L);
        p1.setFarmerName("Sanjay Patel");
        p1.setEntryDate(LocalDate.of(2026, 6, 15));
        p1.setShelfLife(90);
        p1.setSpoilageRisk("Low");
        p1.setStatus("Active");

        Product p2 = new Product();
        p2.setName("Russet Baking Potatoes");
        p2.setType("Vegetables");
        p2.setQuantity(1000.0);
        p2.setStorageId(1L);
        p2.setStorageName("AgriFreeze North Hub");
        p2.setFarmerId(3L);
        p2.setFarmerName("Sanjay Patel");
        p2.setEntryDate(LocalDate.of(2026, 6, 20));
        p2.setShelfLife(120);
        p2.setSpoilageRisk("Medium");
        p2.setStatus("Warning");

        productRepository.saveAll(List.of(p1, p2));
    }

    private void seedBookings() {
        StorageBooking b1 = new StorageBooking("B-001", "3", "Sanjay Patel", "ST-001", "AgriFreeze North Hub",
                "CH-101", "Chamber A (Fruits)", "Fruits", "5,000 kg", LocalDate.of(2026, 7, 10), LocalDate.of(2026, 10, 10), "$1,200", "Approved");

        StorageBooking b2 = new StorageBooking("B-002", "3", "Sanjay Patel", "ST-002", "AgriFreeze West Hub",
                "CH-201", "Chamber Alpha (Produce)", "Vegetables", "3,000 kg", LocalDate.of(2026, 7, 15), LocalDate.of(2026, 9, 15), "$900", "Pending");

        bookingRepository.saveAll(List.of(b1, b2));
    }

    private void seedAlertsAndNotifications() {
        AlertNotification n1 = new AlertNotification("N-001", "Temperature Normalised", "Chamber C (Vegetables)",
                "Chamber C temperature is back to safe levels (6.2°C).", "Success", "Info", "manager", "Resolved", false);

        AlertNotification n2 = new AlertNotification("N-002", "New Storage Request", "Farmer Sanjay Patel",
                "Farmer Sanjay Patel has requested a slot for 3,000kg of Vegetables.", "Info", "Info", "manager", "Active", false);

        AlertNotification n3 = new AlertNotification("A-001", "Chamber C Critical", "Chamber C (Vegetables) - North Hub",
                "Temperature elevated to 8.1°C. Target is 6.0°C.", "Critical", "Critical", "manager", "Active", false);

        notificationRepository.saveAll(List.of(n1, n2, n3));
    }
}
