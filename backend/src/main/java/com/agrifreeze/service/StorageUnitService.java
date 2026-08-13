package com.agrifreeze.service;

import com.agrifreeze.dto.StorageUnitRequest;
import com.agrifreeze.dto.StorageUnitResponse;
import com.agrifreeze.entity.StorageUnit;
import com.agrifreeze.exception.BadRequestException;
import com.agrifreeze.exception.DuplicateResourceException;
import com.agrifreeze.exception.ResourceNotFoundException;
import com.agrifreeze.entity.Chamber;
import com.agrifreeze.entity.AppUser;
import com.agrifreeze.repository.AppUserRepository;
import com.agrifreeze.repository.ChamberRepository;
import com.agrifreeze.repository.StorageUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StorageUnitService {

    private final StorageUnitRepository storageUnitRepository;
    private final ChamberRepository chamberRepository;
    private final AppUserRepository userRepository;
    private final EmailService emailService;

    public StorageUnitService(StorageUnitRepository storageUnitRepository,
                              ChamberRepository chamberRepository,
                              AppUserRepository userRepository,
                              EmailService emailService) {
        this.storageUnitRepository = storageUnitRepository;
        this.chamberRepository = chamberRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public List<StorageUnitResponse> getAllStorages() {
        return storageUnitRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StorageUnitResponse getStorageById(Long id) {
        StorageUnit unit = storageUnitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Storage unit not found with ID: " + id));
        return convertToResponse(unit);
    }

    @Transactional
    public StorageUnitResponse createStorage(StorageUnitRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Storage name cannot be empty");
        }
        if (request.getLocation() == null || request.getLocation().trim().isEmpty()) {
            throw new BadRequestException("Location cannot be empty");
        }
        if (request.getCapacity() == null || request.getCapacity() <= 0) {
            throw new BadRequestException("Capacity must be greater than zero");
        }

        String nameTrimmed = request.getName().trim();
        if (storageUnitRepository.existsByName(nameTrimmed)) {
            throw new DuplicateResourceException("Storage unit with name '" + nameTrimmed + "' already exists");
        }

        String targetManager = (request.getManager() != null && !request.getManager().trim().isEmpty()) 
                ? request.getManager().trim() 
                : "Unassigned";

        if (!targetManager.equalsIgnoreCase("Unassigned")) {
            validateSingleManagerAssignment(targetManager, null);
        }

        StorageUnit unit = new StorageUnit();
        unit.setName(nameTrimmed);
        unit.setCapacity(request.getCapacity());
        unit.setLocation(request.getLocation().trim());
        unit.setManager(targetManager);
        unit.setStatus(request.getStatus() != null ? request.getStatus().trim() : "Active");
        unit.setOccupied(0);
        unit.setTemp(request.getTemp() != null ? request.getTemp() : 4.0);
        unit.setHumidity(request.getHumidity() != null ? request.getHumidity() : 80.0);
        unit.setDoor(request.getDoor() != null ? request.getDoor().trim() : "Closed");
        unit.setPower(request.getPower() != null ? request.getPower().trim() : "Grid");
        unit.setEfficiency(request.getEfficiency() != null ? request.getEfficiency() : 90);

        StorageUnit savedUnit = storageUnitRepository.save(unit);

        // Auto-create equal capacity chambers
        int chamberCount = (request.getChamberCount() != null && request.getChamberCount() > 0) ? request.getChamberCount() : 4;
        int equalCapacity = Math.max(1, request.getCapacity() / chamberCount);
        List<Chamber> newChambers = new ArrayList<>();
        for (int i = 1; i <= chamberCount; i++) {
            String chamberCode = "CH-" + savedUnit.getId() + "0" + i;
            String chamberName = "Chamber " + i + " (" + savedUnit.getName() + ")";
            Chamber chamber = new Chamber(
                    chamberCode,
                    chamberName,
                    savedUnit.getTemp(),
                    savedUnit.getTemp(),
                    equalCapacity,
                    0,
                    savedUnit.getHumidity() + "%",
                    "Cold Storage",
                    "AVAILABLE",
                    savedUnit
            );
            newChambers.add(chamber);
        }
        chamberRepository.saveAll(newChambers);

        triggerManagerAssignmentNotification(savedUnit.getManager(), savedUnit.getName());

        return convertToResponse(savedUnit);
    }

    @Transactional
    public StorageUnitResponse updateStorage(Long id, StorageUnitRequest request) {
        StorageUnit unit = storageUnitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Storage unit not found with ID: " + id));

        if (request.getName() != null) {
            String nameTrimmed = request.getName().trim();
            if (nameTrimmed.isEmpty()) {
                throw new BadRequestException("Storage name cannot be empty");
            }
            if (!nameTrimmed.equalsIgnoreCase(unit.getName())) {
                if (storageUnitRepository.existsByName(nameTrimmed)) {
                    throw new DuplicateResourceException("Storage unit with name '" + nameTrimmed + "' already exists");
                }
            }
            unit.setName(nameTrimmed);
        }

        if (request.getLocation() != null) {
            if (request.getLocation().trim().isEmpty()) {
                throw new BadRequestException("Location cannot be empty");
            }
            unit.setLocation(request.getLocation().trim());
        }

        if (request.getCapacity() != null) {
            if (request.getCapacity() <= 0) {
                throw new BadRequestException("Capacity must be greater than zero");
            }
            unit.setCapacity(request.getCapacity());
        }

        if (request.getManager() != null) {
            String targetManager = request.getManager().trim();
            if (targetManager.isEmpty()) {
                targetManager = "Unassigned";
            }
            if (!targetManager.equalsIgnoreCase("Unassigned") && !targetManager.equalsIgnoreCase(unit.getManager())) {
                validateSingleManagerAssignment(targetManager, unit.getId());
            }
            unit.setManager(targetManager);
        }

        if (request.getStatus() != null) {
            unit.setStatus(request.getStatus().trim().isEmpty() ? "Active" : request.getStatus().trim());
        }

        if (request.getTemp() != null) {
            unit.setTemp(request.getTemp());
        }

        if (request.getHumidity() != null) {
            unit.setHumidity(request.getHumidity());
        }

        if (request.getDoor() != null) {
            unit.setDoor(request.getDoor().trim());
        }

        if (request.getPower() != null) {
            unit.setPower(request.getPower().trim());
        }

        if (request.getEfficiency() != null) {
            unit.setEfficiency(request.getEfficiency());
        }

        StorageUnit updatedUnit = storageUnitRepository.save(unit);
        triggerManagerAssignmentNotification(updatedUnit.getManager(), updatedUnit.getName());
        return convertToResponse(updatedUnit);
    }

    private void triggerManagerAssignmentNotification(String managerName, String storageName) {
        if (managerName == null || managerName.trim().isEmpty() || managerName.equalsIgnoreCase("Unassigned")) {
            return;
        }
        userRepository.findAll().stream()
                .filter(u -> managerName.equalsIgnoreCase(u.getFullName()) || managerName.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .ifPresent(m -> emailService.sendManagerAssignmentEmail(m.getEmail(), m.getFullName(), storageName, "password"));
    }

    private void validateSingleManagerAssignment(String managerName, Long currentStorageId) {
        if (managerName == null || managerName.trim().isEmpty() || managerName.equalsIgnoreCase("Unassigned")) {
            return;
        }
        List<StorageUnit> existingAssignments = storageUnitRepository.findAll().stream()
                .filter(su -> managerName.equalsIgnoreCase(su.getManager()))
                .filter(su -> currentStorageId == null || !su.getId().equals(currentStorageId))
                .collect(Collectors.toList());

        if (!existingAssignments.isEmpty()) {
            StorageUnit assigned = existingAssignments.get(0);
            throw new BadRequestException("Manager '" + managerName + "' is already assigned to another storage facility (" + assigned.getName() + "). A manager can manage ONLY ONE storage facility.");
        }
    }

    @Transactional
    public void deleteStorage(Long id) {
        StorageUnit unit = storageUnitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Storage unit not found with ID: " + id));
        List<Chamber> chambers = chamberRepository.findByStorageUnitId(id);
        if (!chambers.isEmpty()) {
            chamberRepository.deleteAll(chambers);
        }
        storageUnitRepository.delete(unit);
    }

    private StorageUnitResponse convertToResponse(StorageUnit unit) {
        return new StorageUnitResponse(
                unit.getId(),
                unit.getName(),
                unit.getCapacity(),
                unit.getOccupied(),
                unit.getLocation(),
                unit.getManager(),
                unit.getStatus(),
                unit.getTemp(),
                unit.getHumidity(),
                unit.getDoor(),
                unit.getPower(),
                unit.getEfficiency(),
                unit.getCreatedAt()
        );
    }
}
