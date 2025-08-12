// components/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaWarehouse } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '../ui/SkeletonLoader';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<number>(0);
  const [products, setProducts] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  // Fetch dashboard analytics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        // Simulate loading delay for better UX demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Example API calls to get data for dashboard analytics
        const [ordersRes, productsRes, usersRes, inventoryRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/products'),
          fetch('/api/admin/users'),
          fetch('/api/admin/inventory'),
        ]);

        const [ordersData, productsData, usersData, inventoryData] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
          usersRes.json(),
          inventoryRes.json(),
        ]);

        setOrders(ordersData.count || 150); // Fallback values for demo
        setProducts(productsData.count || 89);
        setUsers(usersData.count || 234);
        setInventory(inventoryData.count || 67);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        // Set fallback values in case of API error
        setOrders(150);
        setProducts(89);
        setUsers(234);
        setInventory(67);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show skeleton while auth is loading or data is loading
  if (loading || dataLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col p-6">
      <motion.h1 
        className="text-3xl font-bold mb-6"
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
            <p className="text-gray-500">Users</p>
            <p className="text-2xl font-semibold">{users.toLocaleString()}</p>
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
            <p className="text-gray-500">Products</p>
            <p className="text-2xl font-semibold">{products.toLocaleString()}</p>
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
            <p className="text-gray-500">Orders</p>
            <p className="text-2xl font-semibold">{orders.toLocaleString()}</p>
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
            <p className="text-gray-500">Inventory</p>
            <p className="text-2xl font-semibold">{inventory.toLocaleString()}</p>
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
          <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
          {/* Implement your charting library here (e.g., Chart.js or Recharts) */}
          <div className="h-[300px] bg-gradient-to-br from-orange-50 to-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 font-medium">Chart Coming Soon</p>
          </div>
        </motion.div>

        {/* Example Table for Orders */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Amount</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">#001</td>
                  <td className="py-2">John Doe</td>
                  <td className="py-2">$120.00</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">#002</td>
                  <td className="py-2">Jane Smith</td>
                  <td className="py-2">$85.50</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">#003</td>
                  <td className="py-2">Mike Johnson</td>
                  <td className="py-2">$200.00</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 font-medium">#004</td>
                  <td className="py-2">Sarah Wilson</td>
                  <td className="py-2">$75.25</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;