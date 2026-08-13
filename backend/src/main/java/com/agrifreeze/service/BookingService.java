package com.agrifreeze.service;

import com.agrifreeze.dto.BookingRequest;
import com.agrifreeze.dto.BookingResponse;
import com.agrifreeze.entity.AppUser;
import com.agrifreeze.entity.StorageBooking;
import com.agrifreeze.repository.AppUserRepository;
import com.agrifreeze.repository.StorageBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.agrifreeze.entity.Chamber;
import com.agrifreeze.repository.ChamberRepository;
import com.agrifreeze.entity.StorageUnit;
import com.agrifreeze.repository.AppUserRepository;
import com.agrifreeze.repository.StorageBookingRepository;
import com.agrifreeze.repository.StorageUnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final StorageBookingRepository bookingRepository;
    private final AppUserRepository userRepository;
    private final StorageUnitRepository storageUnitRepository;
    private final ChamberRepository chamberRepository;
    private final EmailService emailService;

    public BookingService(StorageBookingRepository bookingRepository,
                          AppUserRepository userRepository,
                          StorageUnitRepository storageUnitRepository,
                          ChamberRepository chamberRepository,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.storageUnitRepository = storageUnitRepository;
        this.chamberRepository = chamberRepository;
        this.emailService = emailService;
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByFarmerId(String farmerId) {
        return bookingRepository.findByFarmerId(farmerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByStorageId(String storageId) {
        return bookingRepository.findByStorageId(storageId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        StorageBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    public BookingResponse createBooking(BookingRequest request) {
        StorageBooking booking = new StorageBooking();
        booking.setFarmerId(request.getFarmerId());
        booking.setFarmerName(request.getFarmerName());
        booking.setStorageId(request.getStorageId());
        booking.setStorageName(request.getStorageName());
        booking.setChamberId(request.getChamberId());
        booking.setChamberName(request.getChamberName());
        booking.setCategory(request.getCategory());
        booking.setWeight(request.getWeight());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setPrice(request.getPrice());
        booking.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");

        StorageBooking saved = bookingRepository.save(booking);
        saved.setBookingCode("B-" + String.format("%03d", saved.getId()));
        saved = bookingRepository.save(saved);

        // DO NOT mark chamber as BOOKED yet! Chamber remains AVAILABLE/Pending until Manager approves.

        // Email Trigger 1 & 2: Farmer Signup Request Notification & Manager Alert
        try {
            String farmerEmail = null;
            if (request.getFarmerId() != null) {
                try {
                    Long fid = Long.parseLong(request.getFarmerId().replaceAll("[^0-9]", ""));
                    AppUser farmer = userRepository.findById(fid).orElse(null);
                    if (farmer != null) farmerEmail = farmer.getEmail();
                } catch (Exception ignored) {}
            }
            if (farmerEmail == null || !farmerEmail.contains("@")) farmerEmail = "farmer@gmail.com";

            String managerEmail = null;
            if (request.getStorageId() != null) {
                try {
                    Long sid = Long.parseLong(request.getStorageId().replaceAll("[^0-9]", ""));
                    StorageUnit su = storageUnitRepository.findById(sid).orElse(null);
                    if (su != null && su.getManager() != null && !su.getManager().equalsIgnoreCase("Unassigned")) {
                        String mVal = su.getManager();
                        if (mVal.contains("@")) {
                            managerEmail = mVal;
                        } else {
                            AppUser mgrUser = userRepository.findAll().stream()
                                    .filter(u -> u.getRole() != null && u.getRole().equalsIgnoreCase("MANAGER"))
                                    .filter(u -> u.getFullName().equalsIgnoreCase(mVal))
                                    .findFirst().orElse(null);
                            if (mgrUser != null) {
                                managerEmail = mgrUser.getEmail();
                            }
                        }
                    }
                } catch (Exception ignored) {}
            }
            if (managerEmail == null || !managerEmail.contains("@")) managerEmail = "naveen.babu0805@gmail.com";

            emailService.sendFarmerSignupRequestEmail(farmerEmail, request.getFarmerName(), request.getStorageName(), managerEmail);
        } catch (Exception e) {
            // Logged safely in EmailService
        }

        return mapToResponse(saved);
    }

    public BookingResponse updateBookingStatus(Long id, String status) {
        StorageBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(status);
        StorageBooking updated = bookingRepository.save(booking);

        if ("Approved".equalsIgnoreCase(status) || "ACTIVE".equalsIgnoreCase(status)) {
            markChamberAsBooked(booking.getStorageId(), booking.getChamberId(), booking.getChamberName());

            String farmerEmail = "farmer@gmail.com";
            String managerName = "Storage Manager";
            if (booking.getFarmerId() != null) {
                try {
                    Long fid = Long.parseLong(booking.getFarmerId());
                    AppUser farmer = userRepository.findById(fid).orElse(null);
                    if (farmer != null) {
                        farmerEmail = farmer.getEmail();
                        if (!"ACTIVE".equalsIgnoreCase(farmer.getStatus())) {
                            farmer.setStatus("ACTIVE");
                            userRepository.save(farmer);
                        }
                    }
                } catch (Exception ignored) {
                }
            }

            if (booking.getStorageId() != null) {
                try {
                    Long sid = Long.parseLong(booking.getStorageId().replace("ST-", "").replace("STR-", ""));
                    StorageUnit su = storageUnitRepository.findById(sid).orElse(null);
                    if (su != null && su.getManager() != null) {
                        managerName = su.getManager();
                    }
                } catch (Exception ignored) {}
            }

            // Email Trigger 3: Manager Approval Notification to Farmer
            try {
                emailService.sendFarmerApprovalEmail(farmerEmail, booking.getFarmerName(), managerName, booking.getStorageName());
            } catch (Exception e) {
                // Logged safely in EmailService
            }
        }

        if ("Rejected".equalsIgnoreCase(status)) {
            resetChamberToAvailable(booking.getStorageId(), booking.getChamberId(), booking.getChamberName());
        }

        return mapToResponse(updated);
    }

    private void markChamberAsBooked(String storageIdStr, String chamberIdStr, String chamberNameStr) {
        try {
            if (chamberIdStr != null && !chamberIdStr.trim().isEmpty()) {
                try {
                    Long cId = Long.parseLong(chamberIdStr.replaceAll("[^0-9]", ""));
                    Chamber chamber = chamberRepository.findById(cId).orElse(null);
                    if (chamber != null) {
                        chamber.setStatus("BOOKED");
                        if (chamber.getOccupied() == 0) chamber.setOccupied(10);
                        chamberRepository.save(chamber);
                        return;
                    }
                } catch (Exception ignored) {}
            }
            if (storageIdStr != null) {
                Long sId = Long.parseLong(storageIdStr.replaceAll("[^0-9]", ""));
                List<Chamber> chambers = chamberRepository.findByStorageUnitId(sId);
                for (Chamber ch : chambers) {
                    if (chamberNameStr != null && (ch.getName().equalsIgnoreCase(chamberNameStr) || ch.getChamberCode().equalsIgnoreCase(chamberNameStr) || chamberNameStr.toLowerCase().contains(ch.getName().toLowerCase()) || ch.getName().toLowerCase().contains(chamberNameStr.toLowerCase()))) {
                        ch.setStatus("BOOKED");
                        if (ch.getOccupied() == 0) ch.setOccupied(10);
                        chamberRepository.save(ch);
                        break;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Could not mark chamber as booked: " + e.getMessage());
        }
    }

    private void resetChamberToAvailable(String storageIdStr, String chamberIdStr, String chamberNameStr) {
        try {
            if (chamberIdStr != null && !chamberIdStr.trim().isEmpty()) {
                try {
                    Long cId = Long.parseLong(chamberIdStr.replaceAll("[^0-9]", ""));
                    Chamber chamber = chamberRepository.findById(cId).orElse(null);
                    if (chamber != null) {
                        chamber.setStatus("AVAILABLE");
                        chamber.setOccupied(0);
                        chamberRepository.save(chamber);
                        return;
                    }
                } catch (Exception ignored) {}
            }
            if (storageIdStr != null) {
                Long sId = Long.parseLong(storageIdStr.replaceAll("[^0-9]", ""));
                List<Chamber> chambers = chamberRepository.findByStorageUnitId(sId);
                for (Chamber ch : chambers) {
                    if (chamberNameStr != null && (ch.getName().equalsIgnoreCase(chamberNameStr) || ch.getChamberCode().equalsIgnoreCase(chamberNameStr))) {
                        ch.setStatus("AVAILABLE");
                        ch.setOccupied(0);
                        chamberRepository.save(ch);
                        break;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Could not reset chamber to available: " + e.getMessage());
        }
    }

    public void deleteBooking(Long id) {
        StorageBooking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            resetChamberToAvailable(booking.getStorageId(), booking.getChamberId(), booking.getChamberName());
            bookingRepository.delete(booking);
        }
    }

    private BookingResponse mapToResponse(StorageBooking booking) {
        BookingResponse res = new BookingResponse();
        res.setId(booking.getId());
        res.setBookingCode(booking.getBookingCode() != null ? booking.getBookingCode() : "B-" + booking.getId());
        res.setFarmerId(booking.getFarmerId());
        res.setFarmerName(booking.getFarmerName());
        res.setStorageId(booking.getStorageId());
        res.setStorageName(booking.getStorageName());
        res.setChamberId(booking.getChamberId());
        res.setChamberName(booking.getChamberName());
        res.setCategory(booking.getCategory());
        res.setWeight(booking.getWeight());
        res.setStartDate(booking.getStartDate());
        res.setEndDate(booking.getEndDate());
        res.setPrice(booking.getPrice());
        res.setStatus(booking.getStatus());
        return res;
    }
}
