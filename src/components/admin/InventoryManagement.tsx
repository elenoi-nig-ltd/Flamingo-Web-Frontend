'use client';

import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { DashboardSkeleton } from '../ui/SkeletonLoader';

interface InventoryFormData {
  product: string;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface FormErrors {
  product?: string;
  quantity?: string;
  status?: string;
  general?: string;
}

const InventoryManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { inventory, loading: inventoryLoading, error: inventoryError, createInventory, updateInventory, deleteInventory } = useInventory();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentInventoryId, setCurrentInventoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>({
    product: '',
    quantity: 0,
    status: 'in_stock',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<string | null>(null);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.product) errors.product = 'Product is required';
    if (formData.quantity < 0) errors.quantity = 'Quantity cannot be negative';
    if (!['in_stock', 'low_stock', 'out_of_stock'].includes(formData.status)) {
      errors.status = 'Invalid status';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    if (!validateForm()) return;

    const inventoryData = {
      product: formData.product,
      quantity: formData.quantity,
      status: formData.status,
    };

    try {
      if (isEditing && currentInventoryId) {
        await updateInventory(currentInventoryId, inventoryData);
      } else {
        await createInventory(inventoryData);
      }
      setFormData({ product: '', quantity: 0, status: 'in_stock' });
      setIsEditing(false);
      setCurrentInventoryId(null);
      setFormErrors({});
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, general: 'Failed to save inventory' }));
    }
  };

  const handleEdit = (item: { _id: string; product: { _id: string; name: string }; quantity: number; status: 'in_stock' | 'low_stock' | 'out_of_stock' }) => {
    setIsEditing(true);
    setCurrentInventoryId(item._id);
    setFormData({
      product: item.product._id, // Use the product ID instead of the product object
      quantity: item.quantity,
      status: item.status,
    });
    setFormErrors({});
  };

  const handleDeleteClick = (id: string) => {
    setInventoryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (inventoryToDelete) {
      try {
        await deleteInventory(inventoryToDelete);
      } catch (err) {
        setFormErrors((prev) => ({ ...prev, general: 'Failed to delete inventory' }));
      }
    }
    setShowDeleteModal(false);
    setInventoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setInventoryToDelete(null);
  };

  if (authLoading || inventoryLoading || productsLoading) {
    return <DashboardSkeleton />;
  }

  if (inventoryError || productsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">{inventoryError || productsError}</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Inventory Management
      </motion.h1>

      {/* Inventory Form */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg mb-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditing ? 'Edit Inventory' : 'Add New Inventory'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-gray-900 ${
                formErrors.product ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.product ? 'true' : 'false'}
              aria-describedby={formErrors.product ? 'product-error' : undefined}
            >
              <option value="" className="text-gray-900">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id} className="text-gray-900">
                  {product.name}
                </option>
              ))}
            </select>
            {formErrors.product && (
              <p id="product-error" className="text-red-500 text-sm mt-1">
                {formErrors.product}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-gray-900 ${
                formErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              aria-invalid={formErrors.quantity ? 'true' : 'false'}
              aria-describedby={formErrors.quantity ? 'quantity-error' : undefined}
            />
            {formErrors.quantity && (
              <p id="quantity-error" className="text-red-500 text-sm mt-1">
                {formErrors.quantity}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-gray-900 ${
                formErrors.status ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.status ? 'true' : 'false'}
              aria-describedby={formErrors.status ? 'status-error' : undefined}
            >
              <option value="" className="text-gray-900">Select status</option>
              <option value="in_stock" className="text-gray-900">In Stock</option>
              <option value="low_stock" className="text-gray-900">Low Stock</option>
              <option value="out_of_stock" className="text-gray-900">Out of Stock</option>
            </select>
            {formErrors.status && (
              <p id="status-error" className="text-red-500 text-sm mt-1">
                {formErrors.status}
              </p>
            )}
          </div>
          {formErrors.general && (
            <p className="md:col-span-2 text-red-500 text-sm mt-4">{formErrors.general}</p>
          )}
          <motion.button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isEditing ? 'Update Inventory' : 'Add Inventory'}</span>
            {!isEditing && <FaPlus />}
          </motion.button>
        </form>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Inventory List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-800">Product</th>
                <th className="py-3 px-4 text-left text-gray-800">Quantity</th>
                <th className="py-3 px-4 text-left text-gray-800">Status</th>
                <th className="py-3 px-4 text-left text-gray-800">Last Updated</th>
                <th className="py-3 px-4 text-left text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{item.product.name}</td>
                  <td className="py-3 px-4 text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-gray-700">{item.status.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex space-x-3">
                    <motion.button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Edit inventory for ${item.product.name}`}
                    >
                      <FaEdit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(item._id)}
                      className="text-red-600 hover:text-red-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Delete inventory for ${item.product.name}`}
                    >
                      <FaTrash size={18} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this inventory item? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;