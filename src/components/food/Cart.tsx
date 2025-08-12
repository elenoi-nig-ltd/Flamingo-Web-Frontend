'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

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
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(id, newQuantity);
    } else if (newQuantity === 0) {
      onRemoveItem(id);
    }
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
      <button className="w-full mt-4 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
