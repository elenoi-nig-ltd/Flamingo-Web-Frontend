'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart?: () => void;
}

const Cart = ({ isOpen, items, totalPrice, onClose, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(id, newQuantity);
    } else if (newQuantity === 0) {
      onRemoveItem(id);
    }
  };

  const clearCart = () => {
    if (onClearCart) {
      onClearCart();
    } else {
      items.forEach(item => onRemoveItem(item.id));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black text-white z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex flex-col h-full">
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mb-4">Add some delicious food to get started!</p>
                    <button
                      onClick={onClose}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-700">
                    {/* Clear Cart Button */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Items: {items.length}</span>
                      <button
                        onClick={clearCart}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors text-sm"
                      >
                        <FaTrash className="text-xs" />
                        <span>Clear Cart</span>
                      </button>
                    </div>

                    {/* Total Summary */}
                    <div className="bg-amber-50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <p className="text-red-600 font-bold text-xl">
                          Total: ₦{totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button 
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      onClick={() => {
                        // TODO: Implement checkout logic
                        alert('Checkout functionality coming soon!');
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
