'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';


interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(id, newQuantity);
    } else if (newQuantity === 0) {
      onRemoveItem(id);
    }
  };

  const handleCheckout = () => {
    setShowCustomerForm(true);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payment data for our backend API
      const paymentData = {
        tx_ref: `FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: total,
        customer: {
          email: customerInfo.email,
          phone: customerInfo.phone,
          name: customerInfo.name
        }
      };

      // Store order data for callback page
      const orderData = {
        userId: '608f4b3c9b1e8c2f4c8b1234', // You can get this from user context/auth
        items: items.map(item => ({
          product: item.id, // Using item.id as product ID
          quantity: item.quantity
        })),
        totalAmount: total,
        status: 'pending',
        customerInfo: customerInfo,
        tx_ref: paymentData.tx_ref
      };

      // Store in sessionStorage for callback page access
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

      console.log('Sending payment data to backend:', paymentData);

      // Make API request to our backend endpoint
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success && result.checkoutUrl) {
        // Redirect to Flutterwave hosted checkout
        window.location.href = result.checkoutUrl;
      } else {
        alert(result.error || 'Failed to initialize payment. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (items.length === 0) {
    return (
      <div className="bg-black text-white p-6 rounded-lg">
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">Your cart is empty</p>
          <p className="text-gray-500 text-sm mt-2">Add some delicious food to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      {/* Header with Clear Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button
          onClick={onClearCart}
          className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors"
        >
          <FaTrash className="text-sm" />
          <span className="text-sm">Clear</span>
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg"
          >
            {/* Food Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Food Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
              <p className="text-gray-400 text-sm">₦{item.price.toLocaleString()}</p>
            </div>

            {/* Quantity Controls */}
            <div className="bg-amber-50 rounded-lg p-2 flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="text-gray-800 font-semibold min-w-[20px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right flex-shrink-0 ml-2">
              <p className="font-bold text-white text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-amber-50 rounded-lg p-4">
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl">
            Total: ₦{total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={handleCheckout}
        className="w-full mt-4 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
      >
        Proceed to Checkout
      </button>

      {/* Customer Information Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Customer Information
              </h3>
              <p className="text-gray-600">
                Please provide your details to continue with payment
              </p>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerForm(false);
                    setCustomerInfo({ name: '', email: '', phone: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                                 <button
                   type="submit"
                   disabled={isLoading}
                   className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                     isLoading 
                       ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                       : 'bg-red-600 text-white hover:bg-red-700'
                   }`}
                 >
                   {isLoading ? 'Processing...' : 'Continue to Payment'}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;
