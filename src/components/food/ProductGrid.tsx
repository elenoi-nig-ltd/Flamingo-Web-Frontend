'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
  onAddToCart: (product: { id: string; name: string; image: string; price: number }) => void;
}

interface FoodProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
}

const ProductGrid = ({ selectedCategory, searchQuery, onAddToCart }: ProductGridProps) => {
  // Mock data - in a real app, this would come from an API
  const products: FoodProduct[] = [
         // Sharmawa category (9 items)
     {
       id: '1',
       name: 'Chicken Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 2500,
       description: 'Delicious chicken shawarma wrap with fresh vegetables'
     },
     {
       id: '2',
       name: 'Beef Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 2800,
       description: 'Tender beef shawarma with garlic sauce and pickles'
     },
     {
       id: '3',
       name: 'Lamb Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 3200,
       description: 'Premium lamb shawarma with tahini and fresh herbs'
     },
     {
       id: '4',
       name: 'Falafel Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 2200,
       description: 'Vegan falafel wrap with hummus and vegetables'
     },
     {
       id: '5',
       name: 'Mixed Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 3500,
       description: 'Combination of chicken and beef with special sauce'
     },
     {
       id: '6',
       name: 'Spicy Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 2600,
       description: 'Hot and spicy chicken shawarma with chili sauce'
     },
     {
       id: '7',
       name: 'Cheese Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 2400,
       description: 'Grilled halloumi cheese wrap with mint yogurt'
     },
     {
       id: '8',
       name: 'BBQ Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 2900,
       description: 'BBQ glazed chicken shawarma with caramelized onions'
     },
     {
       id: '9',
       name: 'Premium Sharmawa',
       category: 'Sharmawa',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 3800,
       description: 'Luxury shawarma with premium cuts and truffle sauce'
     },
     
     // Chicken and Chips category (9 items)
     {
       id: '10',
       name: 'Classic Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop&crop=center',
       price: 3800,
       description: 'Crispy fried chicken with golden french fries'
     },
     {
       id: '11',
       name: 'Spicy Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 4000,
       description: 'Hot and spicy fried chicken with seasoned fries'
     },
     {
       id: '12',
       name: 'BBQ Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 4200,
       description: 'BBQ glazed chicken with sweet potato fries'
     },
     {
       id: '13',
       name: 'Honey Mustard Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 4100,
       description: 'Honey mustard chicken with waffle fries'
     },
     {
       id: '14',
       name: 'Buffalo Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 4000,
       description: 'Buffalo hot sauce chicken with curly fries'
     },
     {
       id: '15',
       name: 'Garlic Parmesan Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 4300,
       description: 'Garlic parmesan chicken with truffle fries'
     },
     {
       id: '16',
       name: 'Lemon Herb Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 4000,
       description: 'Lemon herb chicken with herb-seasoned fries'
     },
     {
       id: '17',
       name: 'Cajun Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 4100,
       description: 'Cajun spiced chicken with cajun fries'
     },
     {
       id: '18',
       name: 'Teriyaki Chicken & Chips',
       category: 'Chicken and Chips',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 4200,
       description: 'Teriyaki glazed chicken with shoestring fries'
     },
     
     // Noodles category (9 items)
     {
       id: '19',
       name: 'Chicken Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center',
       price: 2800,
       description: 'Stir-fried noodles with chicken and vegetables'
     },
     {
       id: '20',
       name: 'Beef Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 3200,
       description: 'Beef stir-fry noodles with broccoli and carrots'
     },
     {
       id: '21',
       name: 'Shrimp Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop&crop=center',
       price: 3500,
       description: 'Shrimp noodles with snow peas and water chestnuts'
     },
     {
       id: '22',
       name: 'Vegetable Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 2500,
       description: 'Mixed vegetable noodles with tofu and mushrooms'
     },
     {
       id: '23',
       name: 'Spicy Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 3000,
       description: 'Spicy noodles with chili oil and green onions'
     },
     {
       id: '24',
       name: 'Curry Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 3200,
       description: 'Curry flavored noodles with coconut milk sauce'
     },
     {
       id: '25',
       name: 'Pad Thai Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 3800,
       description: 'Traditional pad thai with peanuts and lime'
     },
     {
       id: '26',
       name: 'Lo Mein Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 3000,
       description: 'Lo mein noodles with soy sauce and vegetables'
     },
     {
       id: '27',
       name: 'Udon Noodles',
       category: 'Noodles',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 3200,
       description: 'Thick udon noodles in savory broth with toppings'
     },
     
     // Meat Pie category (9 items)
     {
       id: '28',
       name: 'Classic Meat Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 1200,
       description: 'Flaky pastry filled with savory meat and vegetables'
     },
     {
       id: '29',
       name: 'Chicken Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 1400,
       description: 'Chicken and mushroom pie with creamy sauce'
     },
     {
       id: '30',
       name: 'Beef and Onion Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 1500,
       description: 'Beef and caramelized onion pie with gravy'
     },
     {
       id: '31',
       name: 'Lamb Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 1800,
       description: 'Lamb pie with rosemary and red wine sauce'
     },
     {
       id: '32',
       name: 'Pork Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 1600,
       description: 'Pork and apple pie with sage seasoning'
     },
     {
       id: '33',
       name: 'Fish Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 2000,
       description: 'Fish pie with white wine sauce and herbs'
     },
     {
       id: '34',
       name: 'Vegetable Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
       price: 1000,
       description: 'Mixed vegetable pie with cheese and herbs'
     },
     {
       id: '35',
       name: 'Mushroom Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center',
       price: 1200,
       description: 'Wild mushroom pie with garlic and thyme'
     },
     {
       id: '36',
       name: 'Premium Steak Pie',
       category: 'Meat Pie',
       image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center',
       price: 2500,
       description: 'Premium steak pie with red wine and shallots'
     }
  ];

  // Filter products based on selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyClick = (product: FoodProduct) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price
    });
  };

  return (
    <div className="p-6 rounded-lg">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
                         {/* Product Image */}
             <div className="relative h-48 bg-gray-200 overflow-hidden">
               <img
                 src={product.image}
                 alt={product.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   // Fallback to a generic food image if the specific one fails
                   e.currentTarget.src = `https://picsum.photos/400/300?random=${product.id}`;
                 }}
               />
             </div>
            
            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                                 <span className="text-lg font-bold text-gray-800">
                   ₦{product.price.toLocaleString()}
                 </span>
                <motion.button
                  onClick={() => handleBuyClick(product)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart className="text-sm" />
                  <span>Buy</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
