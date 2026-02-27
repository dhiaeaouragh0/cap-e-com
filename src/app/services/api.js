import axios from 'axios';
import { mockApiResponses } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL ;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = async (page = 1, limit = 12) => {
  try {
    const response = await api.get('/products', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  if (USE_MOCK_DATA) {
    return mockApiResponses.getProductById(id);
  }
  
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to mock data if API fails
    console.log('Using mock data as fallback');
    return mockApiResponses.getProductById(id);
  }
};

// Orders
export const createOrder = async (orderData) => {
  if (USE_MOCK_DATA) {
    return mockApiResponses.createOrder(orderData);
  }
  
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Willaya
export const getWillaya = async () => {
  try {
    const response = await api.get(`/shipping-wilayas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching willaya:', error);
    throw error;
  }
}

export default api;