import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASEURL } from '@/config/api/contants';

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASEURL}/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      const response = await axios.post(`${BASEURL}/categories`, categoryData);
      setCategories((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const updateCategory = async (id: string, categoryData: CategoryFormData): Promise<Category> => {
    try {
      const response = await axios.put(`${BASEURL}/categories/${id}`, categoryData);
      setCategories((prev) =>
        prev.map((category) => (category._id === id ? response.data : category))
      );
      setError(null);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${BASEURL}/categories/${id}`);
      setCategories((prev) => prev.filter((category) => category._id !== id));
      setError(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const getCategoryById = async (id: string): Promise<Category> => {
    try {
      const response = await axios.get(`${BASEURL}/categories/${id}`);
      setError(null);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};