'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { BASEURL } from '@/config/api/contants';
import { getAuthHeaders, clearAuthSession } from '@/utils/auth';
import { getErrorMessage } from '@/utils/checkout';

export interface OrderItem {
  product: string;
  productType: 'food' | 'goods';
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  deliveryOption: 'pickup' | 'delivery';
  deliveryZoneId?: string;
  deliveryAddress?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface AdminCreateOrderDto {
  items: Array<{ product: string; quantity: number }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'expired';
}
export interface OrderCreatedResponse {
  order: {
    _id: string;
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    status: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    deliveryOption: string;
    deliveryAddress?: string;
  };
  guestAccessToken?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
}

interface UpdateOrderDto {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'expired';
}

export const useOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserRole = (): string | null => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.role || null;
      } catch (err) {
        return null;
      }
    }
    return user?.role || null;
  };

  const getValidToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    
    if (!token) return null;
    
    try {
      // Validate token format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return null;
      }
      
      // Check expiration
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        clearAuthSession();
        return null;
      }
      
      return token;
    } catch (err) {
      console.error('Token validation error:', err);
      return null;
    }
  };

  const fetchDeliveryZones = async (): Promise<DeliveryZone[]> => {
    try {
      const response = await fetch(`${BASEURL}/orders/delivery-zones`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  };

  const fetchOrders = async (retryCount = 0) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getValidToken();
      if (!token) {
        throw new Error('No valid authentication token found. Please login again.');
      }

      console.log('Fetching orders with token:', token.substring(0, 20) + '...'); // Debug log

      const response = await fetch(`${BASEURL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      // Handle 401 with retry
      if (response.status === 401 && retryCount < 2) {
        console.log(`Authentication failed, retrying... (${retryCount + 1}/2)`);
        // Clear and retry after a delay
        clearAuthSession();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Try to restore session from user object
        if (user) {
          return fetchOrders(retryCount + 1);
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(getErrorMessage(errorData, `Failed to fetch orders: ${response.status}`));
      }

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching orders';
      setError(errorMessage);
      
      // Clear invalid session if authentication error
      if (errorMessage.includes('401') || 
          errorMessage.includes('Unauthorized') || 
          errorMessage.includes('login again')) {
        clearAuthSession();
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CreateOrderDto | AdminCreateOrderDto): Promise<OrderCreatedResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = getValidToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASEURL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok || !responseData) {
        throw new Error(getErrorMessage(responseData, `Failed to create order: ${response.status}`));
      }

      // Refresh orders after creating a new one
      if (getUserRole() === 'admin') {
        await fetchOrders();
      }

      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating order';
      setError(errorMessage);
      console.error('Create order error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, orderData: UpdateOrderDto) => {
    const role = getUserRole();
    if (role !== 'admin') {
      setError('Unauthorized access');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getValidToken();
      if (!token) {
        throw new Error('No valid authentication token found');
      }

      const response = await fetch(`${BASEURL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(getErrorMessage(errorData, `Failed to update order: ${response.status}`));
      }

      const updatedOrder = await response.json();
      setOrders((currentOrders) => currentOrders.map((order) => (order._id === id ? updatedOrder : order)));
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating order';
      setError(errorMessage);
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        clearAuthSession();
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    const role = getUserRole();
    if (role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getValidToken();
      if (!token) {
        throw new Error('No valid authentication token found');
      }

      const response = await fetch(`${BASEURL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(getErrorMessage(errorData, `Failed to delete order: ${response.status}`));
      }

      setOrders((currentOrders) => currentOrders.filter((order) => order._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting order';
      setError(errorMessage);
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        clearAuthSession();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshOrders = async () => {
    if (getUserRole() === 'admin') {
      await fetchOrders();
    }
  };

  useEffect(() => {
    if (!authLoading) {
      const role = getUserRole();
      if (role === 'admin') {
        fetchOrders();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    fetchDeliveryZones,
    fetchOrders,
    refreshOrders,
    clearError,
  };
};