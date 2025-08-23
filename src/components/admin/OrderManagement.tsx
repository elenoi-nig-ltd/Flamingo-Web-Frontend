'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { DashboardSkeleton } from '../ui/SkeletonLoader';

interface OrderItem {
  product: string;
  quantity: number;
}

interface OrderFormData {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface FormErrors {
  userId?: string;
  items?: string;
  totalAmount?: string;
  status?: string;
  general?: string;
}

const OrdersManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, error: ordersError, createOrder, updateOrder, deleteOrder } = useOrders();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    userId: '',
    items: [{ product: '', quantity: 1 }],
    totalAmount: 0,
    status: 'pending',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.userId) errors.userId = 'User ID is required';
    if (formData.items.length === 0 || formData.items.some((item) => !item.product || item.quantity <= 0)) {
      errors.items = 'At least one valid item with positive quantity is required';
    }
    if (formData.totalAmount <= 0) errors.totalAmount = 'Total amount must be greater than 0';
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(formData.status)) {
      errors.status = 'Invalid status';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'totalAmount' ? Number(value) : value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: field === 'quantity' ? Number(value) : value };
    setFormData((prev) => ({ ...prev, items: newItems }));
    setFormErrors((prev) => ({ ...prev, items: undefined }));
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { product: '', quantity: 1 }] }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    setFormErrors((prev) => ({ ...prev, items: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    if (!validateForm()) return;

    const orderData = {
      userId: formData.userId,
      items: formData.items,
      totalAmount: formData.totalAmount,
      status: formData.status,
    };

    try {
      if (isEditing && currentOrderId) {
        await updateOrder(currentOrderId, { status: formData.status });
      } else {
        await createOrder(orderData);
      }
      setFormData({ userId: '', items: [{ product: '', quantity: 1 }], totalAmount: 0, status: 'pending' });
      setIsEditing(false);
      setCurrentOrderId(null);
      setFormErrors({});
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, general: 'Failed to save order' }));
    }
  };

  const handleEdit = (order: { _id: string; userId: string; items: { product: { _id: string; name: string }; quantity: number }[]; totalAmount: number; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) => {
    setIsEditing(true);
    setCurrentOrderId(order._id);
    setFormData({
      userId: order.userId,
      items: order.items.map((item) => ({ product: item.product._id, quantity: item.quantity })), // Map to product IDs
      totalAmount: order.totalAmount,
      status: order.status,
    });
    setFormErrors({});
  };

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete);
      } catch (err) {
        setFormErrors((prev) => ({ ...prev, general: 'Failed to delete order' }));
      }
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  if (authLoading || ordersLoading || productsLoading) {
    return <DashboardSkeleton />;
  }

  if (ordersError || productsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">{ordersError || productsError}</p>
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
        Orders Management
      </motion.h1>

      {/* Order Form */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg mb-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditing ? 'Edit Order' : 'Add New Order'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-600 mb-1">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.userId ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={isEditing}
              aria-invalid={formErrors.userId ? 'true' : 'false'}
              aria-describedby={formErrors.userId ? 'userId-error' : undefined}
            />
            {formErrors.userId && (
              <p id="userId-error" className="text-red-500 text-sm mt-1">
                {formErrors.userId}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-600 mb-1">
              Total Amount ($)
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.totalAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={isEditing}
              min="0"
              step="0.01"
              aria-invalid={formErrors.totalAmount ? 'true' : 'false'}
              aria-describedby={formErrors.totalAmount ? 'totalAmount-error' : undefined}
            />
            {formErrors.totalAmount && (
              <p id="totalAmount-error" className="text-red-500 text-sm mt-1">
                {formErrors.totalAmount}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.status ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.status ? 'true' : 'false'}
              aria-describedby={formErrors.status ? 'status-error' : undefined}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {formErrors.status && (
              <p id="status-error" className="text-red-500 text-sm mt-1">
                {formErrors.status}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Order Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <select
                  name="product"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                    formErrors.items ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isEditing}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className={`w-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                    formErrors.items ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isEditing}
                  min="1"
                  required
                />
                {!isEditing && (
                  <motion.button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <FaTrash size={18} />
                  </motion.button>
                )}
              </div>
            ))}
            {formErrors.items && (
              <p className="text-red-500 text-sm mt-1">{formErrors.items}</p>
            )}
            {!isEditing && (
              <motion.button
                type="button"
                onClick={addItem}
                className="mt-2 text-blue-600 hover:text-blue-800 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                <span>Add Item</span>
              </motion.button>
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
            <span>{isEditing ? 'Update Order' : 'Add Order'}</span>
            {!isEditing && <FaPlus />}
          </motion.button>
        </form>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Order List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-600">Order ID</th>
                <th className="py-3 px-4 text-left text-gray-600">User ID</th>
                <th className="py-3 px-4 text-left text-gray-600">Items</th>
                <th className="py-3 px-4 text-left text-gray-600">Total Amount</th>
                <th className="py-3 px-4 text-left text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-gray-600">Order Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{order._id}</td>
                  <td className="py-3 px-4 text-gray-600">{order.userId}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.items.map((item) => `${item.product.name} (x${item.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-gray-600">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">{order.status.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex space-x-3">
                    <motion.button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Edit order ${order._id}`}
                    >
                      <FaEdit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(order._id)}
                      className="text-red-600 hover:text-red-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Delete order ${order._id}`}
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
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
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

export default OrdersManagement;