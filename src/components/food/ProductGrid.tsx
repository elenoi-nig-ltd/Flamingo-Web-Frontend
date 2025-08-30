'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useCategories } from '@/hooks/useCategories';
import { usePublicProducts } from '@/hooks/usePublicProducts';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
  onAddToCart: (product: { id: string; name: string; image: string; price: number }) => void;
}

interface FoodProduct {
  _id: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  description: string;
}

const ProductGrid = ({ selectedCategory, searchQuery, onAddToCart }: ProductGridProps) => {
  const { categories } = useCategories();
  const { products, loading, error } = usePublicProducts();
  const [filteredProducts, setFilteredProducts] = useState<FoodProduct[]>([]);

  // Filter products based on selected category and search query
  useEffect(() => {
    if (products.length > 0) {
      let filtered = products;
      
      // Filter by category
      if (selectedCategory !== 'All') {
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
          filtered = products.filter(product => product.category === category._id);
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory, searchQuery, categories]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Use filtered products instead of mock data
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  // Show message if no products found
  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No products found.</p>
        {searchQuery && <p className="text-gray-400">Try adjusting your search terms.</p>}
        {selectedCategory !== 'All' && <p className="text-gray-400">Try selecting a different category.</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {displayProducts.map((product) => (
        <motion.div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : '/assets/images/placeholder-food.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/placeholder-food.jpg';
              }}
            />
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              ₦{product.price.toLocaleString()}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-orange-500 font-bold text-lg">
                ₦{product.price.toLocaleString()}
              </span>
              <motion.button
                onClick={() => onAddToCart({ id: product._id, name: product.name, image: product.images[0], price: product.price })}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart />
                <span>Add</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
