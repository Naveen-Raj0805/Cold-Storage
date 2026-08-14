package com.agrifreeze.controller;

import com.agrifreeze.dto.ApiResponse;
import com.agrifreeze.dto.StorageUnitRequest;
import com.agrifreeze.dto.StorageUnitResponse;
import com.agrifreeze.entity.Chamber;
import com.agrifreeze.repository.ChamberRepository;
import com.agrifreeze.service.StorageUnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storages")
public class StorageUnitController {

    private final StorageUnitService storageUnitService;
    private final ChamberRepository chamberRepository;

    public StorageUnitController(StorageUnitService storageUnitService, ChamberRepository chamberRepository) {
        this.storageUnitService = storageUnitService;
        this.chamberRepository = chamberRepository;
    }

    @GetMapping
    public ResponseEntity<List<StorageUnitResponse>> getAllStorages() {
        List<StorageUnitResponse> storages = storageUnitService.getAllStorages();
        return ResponseEntity.ok(storages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StorageUnitResponse> getStorageById(@PathVariable Long id) {
        StorageUnitResponse storage = storageUnitService.getStorageById(id);
        return ResponseEntity.ok(storage);
    }

    @GetMapping("/{id}/chambers")
    public ResponseEntity<List<Chamber>> getChambersByStorageId(@PathVariable Long id, 
                                                                @RequestParam(required = false) String status,
                                                                @RequestParam(required = false) Long farmerId) {
        List<Chamber> chambers = storageUnitService.getChambersByStorageId(id, status, farmerId);
        return ResponseEntity.ok(chambers);
    }

    @PostMapping
    public ResponseEntity<StorageUnitResponse> createStorage(@RequestBody StorageUnitRequest request) {
        StorageUnitResponse createdStorage = storageUnitService.createStorage(request);
        return ResponseEntity.ok(createdStorage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StorageUnitResponse> updateStorage(@PathVariable Long id, @RequestBody StorageUnitRequest request) {
        StorageUnitResponse updatedStorage = storageUnitService.updateStorage(id, request);
        return ResponseEntity.ok(updatedStorage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStorage(@PathVariable Long id) {
        storageUnitService.deleteStorage(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Storage unit decommissioned and deleted successfully"));
    }
}
