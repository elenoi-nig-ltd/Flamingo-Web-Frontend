'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useCategories } from '@/hooks/useCategories';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
  onAddToCart: (product: { id: string; name: string; image: string; price: number }) => void;
}

interface FoodProduct {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  image: string;
  price: number;
  description: string;
}

const ProductGrid = ({ selectedCategory, searchQuery, onAddToCart }: ProductGridProps) => {
  const { categories } = useCategories();
  const [products, setProducts] = useState<FoodProduct[]>([]);

  // Initialize products with category IDs and names
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Create a mapping of category names to IDs
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.name] = cat._id;
        return acc;
      }, {} as Record<string, string>);

      // Mock data with proper category relationships
      const mockProducts: FoodProduct[] = [
        // Sharmawa category
        {
          id: '1',
          name: 'Chicken Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 2500,
          description: 'Delicious chicken shawarma wrap with fresh vegetables'
        },
        {
          id: '2',
          name: 'Beef Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 2800,
          description: 'Tender beef shawarma with garlic sauce and pickles'
        },
        {
          id: '3',
          name: 'Lamb Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 3200,
          description: 'Premium lamb shawarma with tahini and fresh herbs'
        },
        {
          id: '4',
          name: 'Falafel Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 2200,
          description: 'Vegan falafel wrap with hummus and vegetables'
        },
        {
          id: '5',
          name: 'Mixed Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 3500,
          description: 'Combination of chicken and beef with special sauce'
        },
        {
          id: '6',
          name: 'Spicy Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 2600,
          description: 'Hot and spicy chicken shawarma with chili sauce'
        },
        {
          id: '7',
          name: 'Cheese Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 2400,
          description: 'Grilled halloumi cheese wrap with mint yogurt'
        },
        {
          id: '8',
          name: 'BBQ Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 2900,
          description: 'BBQ glazed chicken shawarma with caramelized onions'
        },
        {
          id: '9',
          name: 'Premium Sharmawa',
          categoryId: categoryMap['Sharmawa'] || 'sharmawa',
          categoryName: 'Sharmawa',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 3800,
          description: 'Luxury shawarma with premium cuts and truffle sauce'
        },
        
        // Chicken and Chips category
        {
          id: '10',
          name: 'Classic Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1800,
          description: 'Crispy fried chicken with golden fries'
        },
        {
          id: '11',
          name: 'Spicy Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 2000,
          description: 'Hot and spicy chicken with seasoned fries'
        },
        {
          id: '12',
          name: 'BBQ Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 2200,
          description: 'BBQ glazed chicken with sweet potato fries'
        },
        {
          id: '13',
          name: 'Honey Mustard Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 2100,
          description: 'Honey mustard chicken with waffle fries'
        },
        {
          id: '14',
          name: 'Garlic Parmesan Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 2300,
          description: 'Garlic parmesan chicken with truffle fries'
        },
        {
          id: '15',
          name: 'Buffalo Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 2000,
          description: 'Buffalo hot sauce chicken with ranch fries'
        },
        {
          id: '16',
          name: 'Teriyaki Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 2200,
          description: 'Teriyaki glazed chicken with Asian fries'
        },
        {
          id: '17',
          name: 'Lemon Herb Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 2100,
          description: 'Lemon herb chicken with herb fries'
        },
        {
          id: '18',
          name: 'Cajun Chicken & Chips',
          categoryId: categoryMap['Chicken and Chips'] || 'chicken-chips',
          categoryName: 'Chicken and Chips',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 2000,
          description: 'Cajun spiced chicken with spicy fries'
        },
        
        // Noodles category
        {
          id: '19',
          name: 'Classic Beef Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1600,
          description: 'Tender beef with egg noodles in rich broth'
        },
        {
          id: '20',
          name: 'Chicken Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1500,
          description: 'Succulent chicken with rice noodles'
        },
        {
          id: '21',
          name: 'Vegetable Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 1400,
          description: 'Fresh vegetables with udon noodles'
        },
        {
          id: '22',
          name: 'Shrimp Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1800,
          description: 'Juicy shrimp with soba noodles'
        },
        {
          id: '23',
          name: 'Pork Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1600,
          description: 'Tender pork with ramen noodles'
        },
        {
          id: '24',
          name: 'Duck Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 2000,
          description: 'Roasted duck with egg noodles'
        },
        {
          id: '25',
          name: 'Lamb Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1900,
          description: 'Tender lamb with hand-pulled noodles'
        },
        {
          id: '26',
          name: 'Fish Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1700,
          description: 'Fresh fish with rice noodles'
        },
        {
          id: '27',
          name: 'Mushroom Noodles',
          categoryId: categoryMap['Noodles'] || 'noodles',
          categoryName: 'Noodles',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 1400,
          description: 'Assorted mushrooms with udon noodles'
        },
        
        // Meat Pie category
        {
          id: '28',
          name: 'Classic Beef Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1200,
          description: 'Traditional beef pie with flaky pastry'
        },
        {
          id: '29',
          name: 'Chicken & Mushroom Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1100,
          description: 'Creamy chicken and mushroom pie'
        },
        {
          id: '30',
          name: 'Lamb & Mint Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 1300,
          description: 'Tender lamb with fresh mint'
        },
        {
          id: '31',
          name: 'Pork & Apple Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1200,
          description: 'Succulent pork with sweet apple'
        },
        {
          id: '32',
          name: 'Steak & Kidney Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1400,
          description: 'Rich steak and kidney pie'
        },
        {
          id: '33',
          name: 'Turkey & Cranberry Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 1300,
          description: 'Festive turkey with cranberry sauce'
        },
        {
          id: '34',
          name: 'Venison Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
          price: 1500,
          description: 'Game venison with red wine sauce'
        },
        {
          id: '35',
          name: 'Rabbit Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
          price: 1400,
          description: 'Tender rabbit with herbs'
        },
        {
          id: '36',
          name: 'Duck & Orange Pie',
          categoryId: categoryMap['Meat Pie'] || 'meat-pie',
          categoryName: 'Meat Pie',
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
          price: 1600,
          description: 'Roasted duck with orange sauce'
        }
      ];

      setProducts(mockProducts);
    }
  }, [categories]);

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.categoryName === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
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
                onClick={() => onAddToCart(product)}
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
