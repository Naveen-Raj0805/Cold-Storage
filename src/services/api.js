const BASE_URL = 'http://localhost:8083/api';

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!response.ok) {
    const errorMsg = data.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getStorages = async () => {
  const response = await fetch(`${BASE_URL}/storages`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getStorage = async (id) => {
  const response = await fetch(`${BASE_URL}/storages/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const createStorage = async (storageData) => {
  const response = await fetch(`${BASE_URL}/storages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storageData),
  });
  return handleResponse(response);
};

export const updateStorage = async (id, storageData) => {
  const response = await fetch(`${BASE_URL}/storages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storageData),
  });
  return handleResponse(response);
};

export const deleteStorage = async (id) => {
  const response = await fetch(`${BASE_URL}/storages/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

// --- PRODUCT MANAGEMENT API ENDPOINTS ---

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getProductsByFarmer = async (farmerId) => {
  const response = await fetch(`${BASE_URL}/products/farmer/${farmerId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
};

// --- BOOKINGS, ALERTS & ANALYTICS ENDPOINTS ---

export const getBookings = async () => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

export const createBooking = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const getAlerts = async () => {
  const response = await fetch(`${BASE_URL}/alerts`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

export const getNotifications = async (role) => {
  const url = role ? `${BASE_URL}/notifications?role=${role}` : `${BASE_URL}/notifications`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

export const getChambersByStorage = async (storageId, status) => {
  const url = status ? `${BASE_URL}/storages/${storageId}/chambers?status=${encodeURIComponent(status)}` : `${BASE_URL}/storages/${storageId}/chambers`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

export const updateBookingStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/bookings/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

export const getAnalytics = async () => {
  const response = await fetch(`${BASE_URL}/analytics`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse(response);
};

