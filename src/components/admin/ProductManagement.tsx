'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import { DashboardSkeleton } from '../ui/SkeletonLoader';
import axios from 'axios';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

// Extend the form errors type to include a general error
interface FormErrors extends Partial<ProductFormData> {
  general?: string;
}

const ProductManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    images: [],
  });
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    // if (formData.price <= 0) errors.price = 'Price must be greater than 0';
    // if (formData.stock < 0) errors.stock = 'Stock cannot be negative';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
    } catch (err) {
      console.error('Image upload failed:', err);
      // setFormErrors((prev) => ({ ...prev, images: 'Failed to upload image' }));
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    if (!validateForm()) return;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
      images: formData.images,
    };

    try {
      if (isEditing && currentProductId) {
        await updateProduct(currentProductId, productData);
      } else {
        await createProduct(productData);
      }

      // Reset form
      setFormData({ name: '', description: '', price: 0, category: '', stock: 0, images: [] });
      setIsEditing(false);
      setCurrentProductId(null);
      setFormErrors({});
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, general: 'Failed to save product' }));
    }
  };

  const handleEdit = (product: ProductFormData & { _id: string }) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">{error}</p>
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
        Product Management
      </motion.h1>

      {/* Product Form */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg mb-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.name ? 'true' : 'false'}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
            />
            {formErrors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {formErrors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.category ? 'true' : 'false'}
              aria-describedby={formErrors.category ? 'category-error' : undefined}
            />
            {formErrors.category && (
              <p id="category-error" className="text-red-500 text-sm mt-1">
                {formErrors.category}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              step="0.01"
              aria-invalid={formErrors.price ? 'true' : 'false'}
              aria-describedby={formErrors.price ? 'price-error' : undefined}
            />
            {formErrors.price && (
              <p id="price-error" className="text-red-500 text-sm mt-1">
                {formErrors.price}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-600 mb-1">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              aria-invalid={formErrors.stock ? 'true' : 'false'}
              aria-describedby={formErrors.stock ? 'stock-error' : undefined}
            />
            {formErrors.stock && (
              <p id="stock-error" className="text-red-500 text-sm mt-1">
                {formErrors.stock}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-y h-32 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.description ? 'true' : 'false'}
              aria-describedby={formErrors.description ? 'description-error' : undefined}
            />
            {formErrors.description && (
              <p id="description-error" className="text-red-500 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-600 mb-1">
              Upload Images
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                disabled={imageUploading}
              />
              {imageUploading && <FaSpinner className="animate-spin text-blue-500" />}
            </div>
            {formErrors.images && (
              <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>
            )}
            {formData.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
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
            disabled={imageUploading}
          >
            <span>{isEditing ? 'Update Product' : 'Add Product'}</span>
            {!isEditing && <FaPlus />}
          </motion.button>
        </form>
      </motion.div>

      {/* Product Table */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Product List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-600">Image</th>
                <th className="py-3 px-4 text-left text-gray-600">Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Category</th>
                <th className="py-3 px-4 text-left text-gray-600">Price</th>
                <th className="py-3 px-4 text-left text-gray-600">Stock</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <FaBox className="text-gray-400" />
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{product.name}</td>
                  <td className="py-3 px-4 text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 text-gray-600">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                  <td className="py-3 px-4 flex space-x-3">
                    <motion.button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Edit ${product.name}`}
                    >
                      <FaEdit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Delete ${product.name}`}
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
    </div>
  );
};

export default ProductManagement;