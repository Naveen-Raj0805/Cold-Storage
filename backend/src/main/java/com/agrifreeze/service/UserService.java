package com.agrifreeze.service;

import com.agrifreeze.dto.UserResponse;
import com.agrifreeze.dto.UserUpdateRequest;
import com.agrifreeze.entity.AppUser;
import com.agrifreeze.exception.BadRequestException;
import com.agrifreeze.exception.ResourceNotFoundException;
import com.agrifreeze.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.agrifreeze.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.agrifreeze.entity.Chamber;
import com.agrifreeze.entity.StorageBooking;
import com.agrifreeze.repository.ChamberRepository;
import com.agrifreeze.repository.StorageBookingRepository;
import com.agrifreeze.repository.StorageUnitRepository;

@Service
public class UserService {

    private static final Set<String> VALID_ROLES = Set.of("ADMIN", "MANAGER", "FARMER");

    private final AppUserRepository userRepository;
    private final StorageBookingRepository bookingRepository;
    private final ChamberRepository chamberRepository;
    private final StorageUnitRepository storageUnitRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository userRepository,
                       StorageBookingRepository bookingRepository,
                       ChamberRepository chamberRepository,
                       StorageUnitRepository storageUnitRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.chamberRepository = chamberRepository;
        this.storageUnitRepository = storageUnitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (request.getFullName() != null) {
            if (request.getFullName().trim().isEmpty()) {
                throw new BadRequestException("Full name cannot be empty");
            }
            user.setFullName(request.getFullName().trim());
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.findByEmail(newEmail).isPresent()) {
                    throw new BadRequestException("Email " + newEmail + " is already taken by another account.");
                }
                user.setEmail(newEmail);
            }
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim().isEmpty() ? null : request.getPhone().trim());
        }

        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new BadRequestException("Current password is required to change password");
            }
            boolean matches = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword());
            if (!matches) {
                throw new UnauthorizedException("Incorrect current password");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (request.getRole() != null) {
            String roleUpper = request.getRole().trim().toUpperCase();
            if (!roleUpper.isEmpty()) {
                if (!VALID_ROLES.contains(roleUpper)) {
                    throw new BadRequestException("Invalid role: '" + request.getRole() + "'. Allowed roles are ADMIN, MANAGER, or FARMER");
                }
                user.setRole(roleUpper);
            }
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus().trim().isEmpty() ? "ACTIVE" : request.getStatus().trim());
        }

        AppUser updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        String uIdStr = String.valueOf(user.getId());
        String uName = user.getFullName();
        String uEmail = user.getEmail();

        // Invariant 4: Soft delete user (set status to INACTIVE)
        user.setStatus("INACTIVE");
        userRepository.save(user);

        // TODO: normalize storage_units.manager to a manager_id FK referencing
        // app_users.id — string-matching by name/email breaks silently if a
        // manager's display name is ever edited.
        if ("MANAGER".equalsIgnoreCase(user.getRole())) {
            List<com.agrifreeze.entity.StorageUnit> managedStorages = storageUnitRepository.findAll().stream()
                    .filter(su -> su.getManager() != null && (
                            su.getManager().equalsIgnoreCase(uName) ||
                            su.getManager().equalsIgnoreCase(uEmail) ||
                            su.getManager().equalsIgnoreCase(uIdStr)
                    ))
                    .collect(Collectors.toList());

            for (com.agrifreeze.entity.StorageUnit storage : managedStorages) {
                storage.setManager("Unassigned");
                storageUnitRepository.save(storage);
            }
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

    private UserResponse convertToUserResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getExperience(),
                user.getCreatedAt()
        );
    }
}
