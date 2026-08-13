/**
 * Event-Driven Notification Engine Service
 * Evaluates live system events across completed modules (Products & Storage Units)
 */

export const generateEventNotifications = (products = [], storages = []) => {
  const notifications = [];

  // 1. Product Expired & High Spoilage Risk Events
  products.forEach((product) => {
    const isExpired = product.status === 'Expired' || (product.shelfLife != null && product.shelfLife <= 0);
    const isHighRisk = product.spoilageRisk === 'High';

    if (isExpired) {
      notifications.push({
        id: `NTF-PRD-EXP-${product.id}`,
        title: `Product Expired: ${product.name} (${product.farmerName || product.farmer || 'Farmer'})`,
        type: 'alert',
        severity: 'danger',
        category: 'product',
        farmerId: product.farmerId,
        farmerName: product.farmerName || product.farmer,
        storageId: product.storageId,
        storageName: product.storageName || product.storage,
        time: 'Just now',
        read: false
      });
    } else if (isHighRisk) {
      notifications.push({
        id: `NTF-PRD-RSK-${product.id}`,
        title: `High Spoilage Risk: ${product.name} (Shelf life: ${product.shelfLife || 0} days remaining)`,
        type: 'alert',
        severity: 'warning',
        category: 'product',
        farmerId: product.farmerId,
        farmerName: product.farmerName || product.farmer,
        storageId: product.storageId,
        storageName: product.storageName || product.storage,
        time: 'Active risk',
        read: false
      });
    }
  });

  // 2. Storage Unit Capacity, Power, & Door Events
  storages.forEach((unit) => {
    const capacity = unit.capacity || 0;
    const occupied = unit.occupied || 0;
    const isFull = capacity > 0 && occupied >= capacity;
    const isPowerFailure = unit.power && unit.power !== 'Grid';
    const isDoorOpen = unit.door && unit.door !== 'Closed';

    if (isFull) {
      notifications.push({
        id: `NTF-STR-FUL-${unit.id}`,
        title: `Storage Capacity Full: ${unit.name} (${occupied}/${capacity} Tons)`,
        type: 'capacity',
        severity: 'warning',
        category: 'storage',
        storageId: unit.id,
        storageName: unit.name,
        time: 'Full capacity',
        read: false
      });
    }

    if (isPowerFailure) {
      notifications.push({
        id: `NTF-STR-PWR-${unit.id}`,
        title: `Power Anomaly: ${unit.name} running on ${unit.power}`,
        type: 'alert',
        severity: 'danger',
        category: 'storage',
        storageId: unit.id,
        storageName: unit.name,
        time: 'Active event',
        read: false
      });
    }

    if (isDoorOpen) {
      notifications.push({
        id: `NTF-STR-DOR-${unit.id}`,
        title: `Security Warning: Door open in ${unit.name}`,
        type: 'alert',
        severity: 'warning',
        category: 'storage',
        storageId: unit.id,
        storageName: unit.name,
        time: 'Active event',
        read: false
      });
    }
  });

  return notifications;
};
