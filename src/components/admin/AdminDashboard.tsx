// components/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaWarehouse } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useUsers } from '@/hooks/useUsers';
import { useInventory } from '@/hooks/useInventory';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '../ui/SkeletonLoader';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  
  // Use hooks instead of manual API calls
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const { users, loading: usersLoading } = useUsers();
  const { inventory, loading: inventoryLoading } = useInventory();
  
  // Calculate counts from hook data
  const productsCount = products.length;
  const ordersCount = orders.length;
  const usersCount = users.length;
  const inventoryCount = inventory.length;
  
  // Check if any hook is still loading
  const dataLoading = productsLoading || ordersLoading || usersLoading || inventoryLoading;

  // Show skeleton while auth is loading or data is loading
  if (loading || dataLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col p-6">
      <motion.h1 
        className="text-3xl text-gray-800 font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Overview
      </motion.h1>

      {/* Cards Displaying Analytics */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div>
            <p className="text-gray-700">Users</p>
            <p className="text-2xl font-semibold">{usersCount.toLocaleString()}</p>
          </div>
          <FaUsers className="text-orange-400 text-4xl" />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div>
            <p className="text-gray-700">Products</p>
            <p className="text-2xl font-semibold">{productsCount.toLocaleString()}</p>
          </div>
          <FaBox className="text-orange-400 text-4xl" />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div>
            <p className="text-gray-700">Orders</p>
            <p className="text-2xl font-semibold">{ordersCount.toLocaleString()}</p>
          </div>
          <FaShoppingCart className="text-orange-400 text-4xl" />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div>
            <p className="text-gray-700">Inventory</p>
            <p className="text-2xl font-semibold">{inventoryCount.toLocaleString()}</p>
          </div>
          <FaWarehouse className="text-orange-400 text-4xl" />
        </motion.div>
      </motion.div>

      {/* Graphs and Tables for Detailed Analytics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Example Graph */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales Analytics</h2>
          {/* Implement your charting library here (e.g., Chart.js or Recharts) */}
          <div className="h-[300px] bg-gradient-to-br from-orange-50 to-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-600 font-medium">Chart Coming Soon</p>
          </div>
        </motion.div>

        {/* Example Table for Orders */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 text-left text-gray-800">Order ID</th>
                  <th className="py-2 text-left text-gray-800">Customer</th>
                  <th className="py-2 text-left text-gray-800">Amount</th>
                  <th className="py-2 text-left text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map((order, index) => (
                  <tr key={order._id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-2 font-medium text-gray-600">#{order._id.slice(-3)}</td>
                    <td className="py-2 text-gray-600">{order.userId || 'Guest'}</td>
                    <td className="py-2 text-gray-600">₦{order.totalAmount?.toLocaleString() || '0'}</td>
                    <td className="py-2 text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-600">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;