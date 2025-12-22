/**
 * ORIA FRESH - Zentraler API Client
 * Alle API-Aufrufe gehen über diesen Client
 */

const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';
const API_BASE = `${BASE_URL}/api`;

// Token aus localStorage holen
const getAuthToken = () => localStorage.getItem('admin_token');

// Basis-Fetch mit Error-Handling
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Auth-Token hinzufügen wenn vorhanden
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const json = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(json?.error || json?.message || `HTTP ${response.status}`);
  }
  
  return json;
}

// GET Request
export async function apiGet(path) {
  return apiFetch(path, { method: 'GET' });
}

// POST Request
export async function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PUT Request
export async function apiPut(path, body) {
  return apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// DELETE Request
export async function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

// Auth-spezifische Funktionen
export async function apiLogin(email, password) {
  const response = await apiPost('/admin/login', { email, password });
  if (response.access_token || response.token) {
    localStorage.setItem('admin_token', response.access_token || response.token);
  }
  return response;
}

export function apiLogout() {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated() {
  return !!getAuthToken();
}

// API Endpoints - Shorthand Functions
export const api = {
  // Öffentliche Endpoints
  getCategories: () => apiGet('/categories'),
  getProducts: (category) => apiGet(category ? `/products?category=${category}` : '/products'),
  getProduct: (id) => apiGet(`/products/${id}`),
  getBestsellers: () => apiGet('/bestsellers'),
  getSettings: () => apiGet('/settings'),
  getExtras: () => apiGet('/extras'),
  
  // Bestellungen
  createOrder: (orderData) => apiPost('/orders', orderData),
  getOrderStatus: (orderId) => apiGet(`/orders/${orderId}/status`),
  
  // Kontakt
  sendContact: (data) => apiPost('/contact', data),
  
  // Admin
  login: apiLogin,
  logout: apiLogout,
  getMe: () => apiGet('/admin/me'),
  getDashboard: () => apiGet('/admin/dashboard'),
  getOrders: (params) => apiGet(`/admin/orders${params || ''}`),
  updateOrderStatus: (orderId, status) => apiPut(`/admin/orders/${orderId}/status?new_status=${status}`, {}),
  getAdminProducts: () => apiGet('/admin/products'),
  createProduct: (data) => apiPost('/admin/products', data),
  updateProduct: (id, data) => apiPut(`/admin/products/${id}`, data),
  deleteProduct: (id) => apiDelete(`/admin/products/${id}`),
  updateSettings: (data) => apiPut('/admin/settings', data),
  changePassword: (data) => apiPost('/admin/change-password', data),
};

export default api;
