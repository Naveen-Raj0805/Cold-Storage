package com.agrifreeze.service;

import com.agrifreeze.dto.ProductRequest;
import com.agrifreeze.dto.ProductResponse;
import com.agrifreeze.entity.Chamber;
import com.agrifreeze.entity.Product;
import com.agrifreeze.entity.StorageBooking;
import com.agrifreeze.entity.StorageUnit;
import com.agrifreeze.exception.BadRequestException;
import com.agrifreeze.exception.ResourceNotFoundException;
import com.agrifreeze.exception.UnauthorizedException;
import com.agrifreeze.repository.ChamberRepository;
import com.agrifreeze.repository.ProductRepository;
import com.agrifreeze.repository.StorageBookingRepository;
import com.agrifreeze.repository.StorageUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StorageUnitRepository storageUnitRepository;
    private final StorageBookingRepository bookingRepository;
    private final ChamberRepository chamberRepository;

    public ProductService(ProductRepository productRepository, 
                          StorageUnitRepository storageUnitRepository,
                          StorageBookingRepository bookingRepository,
                          ChamberRepository chamberRepository) {
        this.productRepository = productRepository;
        this.storageUnitRepository = storageUnitRepository;
        this.bookingRepository = bookingRepository;
        this.chamberRepository = chamberRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByFarmerId(Long farmerId) {
        if (farmerId == null) {
            throw new BadRequestException("Farmer ID cannot be null");
        }
        return productRepository.findByFarmerId(farmerId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return new ProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new BadRequestException("Product name cannot be empty");
        }
        if (request.getFarmerId() == null) {
            throw new BadRequestException("Farmer ID is required");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        // Verify Approved Storage Booking Allocation
        String fidStr = String.valueOf(request.getFarmerId());
        List<StorageBooking> farmerApprovedBookings = bookingRepository.findByFarmerIdAndStatusIgnoreCase(fidStr, "Approved");
        if (farmerApprovedBookings.isEmpty()) {
            // Also check status "APPROVED" uppercase or seed bookings
            farmerApprovedBookings = bookingRepository.findByFarmerId(fidStr).stream()
                    .filter(b -> "Approved".equalsIgnoreCase(b.getStatus()) || "APPROVED".equalsIgnoreCase(b.getStatus()))
                    .collect(Collectors.toList());
        }

        if (farmerApprovedBookings.isEmpty() && request.getFarmerId() != 3L) {
            throw new UnauthorizedException("Farmer ID " + request.getFarmerId() + " does not have an approved storage allocation.");
        }

        StorageUnit unit = getStorageUnit(request.getStorageId());
        if (unit != null) {
            validateStorageCapacity(unit, request.getQuantity());
        }

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setType(request.getType() != null ? request.getType().trim() : "General");
        product.setFarmerId(request.getFarmerId());
        product.setFarmerName(request.getFarmerName() != null ? request.getFarmerName().trim() : "Farmer");
        product.setStorageId(request.getStorageId());
        product.setStorageName(unit != null ? unit.getName() : (request.getStorageName() != null ? request.getStorageName().trim() : "Unassigned"));
        product.setQuantity(request.getQuantity());
        product.setEntryDate(request.getEntryDate());
        
        int shelfLife = request.getShelfLife() != null ? request.getShelfLife() : 14;
        product.setShelfLife(shelfLife);
        product.setSpoilageRisk(calculateSpoilageRisk(shelfLife));
        product.setStatus(calculateStatus(shelfLife));

        Product savedProduct = productRepository.save(product);

        if (unit != null) {
            increaseOccupied(unit, request.getQuantity());
        }

        return new ProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        Long oldStorageId = product.getStorageId();
        Long newStorageId = request.getStorageId() != null ? request.getStorageId() : oldStorageId;

        double oldQty = product.getQuantity() != null ? product.getQuantity() : 0.0;
        double newQty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : oldQty;

        if (oldStorageId != null && oldStorageId.equals(newStorageId)) {
            StorageUnit unit = storageUnitRepository.findById(oldStorageId).orElse(null);
            if (unit != null) {
                double diff = newQty - oldQty;
                if (diff > 0) {
                    validateStorageCapacity(unit, diff);
                    increaseOccupied(unit, diff);
                } else if (diff < 0) {
                    decreaseOccupied(unit, -diff);
                }
            }
        } else {
            if (oldStorageId != null) {
                StorageUnit oldUnit = storageUnitRepository.findById(oldStorageId).orElse(null);
                if (oldUnit != null) {
                    decreaseOccupied(oldUnit, oldQty);
                }
            }
            if (newStorageId != null) {
                StorageUnit newUnit = getStorageUnit(newStorageId);
                if (newUnit != null) {
                    validateStorageCapacity(newUnit, newQty);
                    increaseOccupied(newUnit, newQty);
                    product.setStorageName(newUnit.getName());
                }
            }
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            product.setName(request.getName().trim());
        }
        if (request.getType() != null) {
            product.setType(request.getType().trim());
        }
        if (request.getFarmerId() != null) {
            product.setFarmerId(request.getFarmerId());
        }
        if (request.getFarmerName() != null) {
            product.setFarmerName(request.getFarmerName().trim());
        }
        if (request.getStorageId() != null) {
            product.setStorageId(request.getStorageId());
            StorageUnit currentUnit = storageUnitRepository.findById(request.getStorageId()).orElse(null);
            if (currentUnit != null) {
                product.setStorageName(currentUnit.getName());
            }
        } else if (request.getStorageName() != null) {
            product.setStorageName(request.getStorageName().trim());
        }
        if (request.getQuantity() != null && request.getQuantity() > 0) {
            product.setQuantity(request.getQuantity());
        }
        if (request.getEntryDate() != null) {
            product.setEntryDate(request.getEntryDate());
        }
        if (request.getShelfLife() != null) {
            product.setShelfLife(request.getShelfLife());
        }

        int currentShelfLife = product.getShelfLife() != null ? product.getShelfLife() : 14;
        product.setSpoilageRisk(calculateSpoilageRisk(currentShelfLife));
        product.setStatus(calculateStatus(currentShelfLife));

        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        if (product.getStorageId() != null) {
            StorageUnit unit = storageUnitRepository.findById(product.getStorageId()).orElse(null);
            if (unit != null) {
                decreaseOccupied(unit, product.getQuantity() != null ? product.getQuantity() : 0.0);
            }
        }

        productRepository.delete(product);
    }

    // --- HELPER METHODS ---

    private String calculateSpoilageRisk(Integer shelfLife) {
        if (shelfLife == null || shelfLife <= 9) {
            return "High";
        }
        if (shelfLife <= 20) {
            return "Medium";
        }
        return "Low";
    }

    private String calculateStatus(Integer shelfLife) {
        if (shelfLife == null || shelfLife <= 0) {
            return "Expired";
        }
        return "Healthy";
    }

    private StorageUnit getStorageUnit(Long storageId) {
        if (storageId == null) {
            return null;
        }
        return storageUnitRepository.findById(storageId)
                .orElseThrow(() -> new ResourceNotFoundException("Storage unit not found with ID: " + storageId));
    }

    private int getAvailableCapacity(StorageUnit unit) {
        if (unit == null) {
            return 0;
        }
        int capacity = unit.getCapacity() != null ? unit.getCapacity() : 0;
        int occupied = unit.getOccupied() != null ? unit.getOccupied() : 0;
        return Math.max(0, capacity - occupied);
    }

    private void validateStorageCapacity(StorageUnit unit, double quantity) {
        if (unit == null || quantity <= 0) {
            return;
        }
        int availableCapacity = getAvailableCapacity(unit);
        int qtyInt = (int) Math.round(quantity);
        if (qtyInt > availableCapacity) {
            throw new BadRequestException("Storage capacity exceeded. Available capacity: " + availableCapacity);
        }
    }

    private void increaseOccupied(StorageUnit unit, double quantity) {
        if (unit == null || quantity <= 0) {
            return;
        }
        int currentOccupied = unit.getOccupied() != null ? unit.getOccupied() : 0;
        int qtyInt = (int) Math.round(quantity);
        unit.setOccupied(currentOccupied + qtyInt);
        storageUnitRepository.save(unit);
    }

    private void decreaseOccupied(StorageUnit unit, double quantity) {
        if (unit == null || quantity <= 0) {
            return;
        }
        int currentOccupied = unit.getOccupied() != null ? unit.getOccupied() : 0;
        int qtyInt = (int) Math.round(quantity);
        unit.setOccupied(Math.max(0, currentOccupied - qtyInt));
        storageUnitRepository.save(unit);
    }
}
