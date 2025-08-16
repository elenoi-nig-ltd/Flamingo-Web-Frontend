'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getCookie } from 'cookies-next';
import { BASEURL } from '@/config/api/contants';

interface Order {
  _id: string;
  userId: string;
  items: { product: { _id: string; name: string }; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

interface CreateOrderDto {
  userId: string;
  items: { product: string; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface UpdateOrderDto {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export const useOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get user role from localStorage
  const getUserRole = (): string | null => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.role || null;
      } catch (err) {
        console.error('Error parsing stored user:', err);
        return null;
      }
    }
    return user?.role || null;
  };

  // Fetch all orders
  const fetchOrders = async () => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASEURL}/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create an order
  const createOrder = async (orderData: CreateOrderDto) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASEURL}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await response.json();
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update an order
  const updateOrder = async (id: string, orderData: UpdateOrderDto) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASEURL}/orders/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      setOrders(orders.map((o) => (o._id === id ? updatedOrder : o)));
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id: string) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASEURL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount and when user changes
  useEffect(() => {
    if (!authLoading) {
      const role = getUserRole();
      if (role === 'admin') {
        fetchOrders();
      } else {
        setError('Admin access required');
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  return { orders, loading, error, createOrder, updateOrder, deleteOrder };
};