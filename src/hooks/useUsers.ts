'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getCookie } from 'cookies-next';
import { BASEURL } from '@/config/api/contants';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
export const useUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
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

  // Fetch all users
  const fetchUsers = async () => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken()
      console.log('Fetching users with token:', token); // Debug: Log token
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASEURL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a user
  const createUser = async (userData: CreateUserDto) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      console.log('Creating user with token:', token); // Debug: Log token
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASEURL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (id: string, userData: UpdateUserDto) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      console.log('Updating user with token:', token); // Debug: Log token
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASEURL}/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (id: string) => {
    const role = getUserRole();
    if (!role || role !== 'admin') {
      setError('Unauthorized access');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      console.log('Deleting user with token:', token); // Debug: Log token
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${BASEURL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount and when user changes
  useEffect(() => {
    if (!authLoading) {
      const role = getUserRole();
      if (role === 'admin') {
        fetchUsers();
      } else {
        setError('Admin access required');
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  return { users, loading, error, createUser, updateUser, deleteUser };
};