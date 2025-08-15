'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import { DashboardSkeleton } from '../ui/SkeletonLoader';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  general?: string;
}

const UserManagement = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { users, loading: usersLoading, error: usersError, createUser, updateUser, deleteUser } = useUsers();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!isEditing && !formData.password) errors.password = 'Password is required';
    if (!formData.role) errors.role = 'Role is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;

    if (!validateForm()) return;

    try {
      if (isEditing && currentUserId) {
        const userData: Partial<CreateUserDto> = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          userData.password = formData.password;
        }
        await updateUser(currentUserId, userData);
      } else {
        const userData: CreateUserDto = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        await createUser(userData);
      }
      setFormData({ username: '', email: '', password: '', role: '' });
      setIsEditing(false);
      setCurrentUserId(null);
      setFormErrors({});
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : 'Failed to save user',
      }));
    }
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setCurrentUserId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setFormErrors({});
  };

  const handleDeleteClick = (id: string) => {
    if (id === currentUser?._id) {
      setFormErrors((prev) => ({ ...prev, general: 'Cannot delete your own account' }));
      return;
    }
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete);
      } catch (err) {
        setFormErrors((prev) => ({
          ...prev,
          general: err instanceof Error ? err.message : 'Failed to delete user',
        }));
      }
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  if (authLoading || usersLoading) {
    return <DashboardSkeleton />;
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 font-semibold">{usersError}</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
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
        User Management
      </motion.h1>

      {/* User Form */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg mb-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.username ? 'true' : 'false'}
              aria-describedby={formErrors.username ? 'username-error' : undefined}
            />
            {formErrors.username && (
              <p id="username-error" className="text-red-500 text-sm mt-1">
                {formErrors.username}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.email ? 'true' : 'false'}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
            {formErrors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {formErrors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password {isEditing && '(Leave blank to keep unchanged)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required={!isEditing}
              aria-invalid={formErrors.password ? 'true' : 'false'}
              aria-describedby={formErrors.password ? 'password-error' : undefined}
            />
            {formErrors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {formErrors.password}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formErrors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={formErrors.role ? 'true' : 'false'}
              aria-describedby={formErrors.role ? 'role-error' : undefined}
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
            {formErrors.role && (
              <p id="role-error" className="text-red-500 text-sm mt-1">
                {formErrors.role}
              </p>
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
            <span>{isEditing ? 'Update User' : 'Add User'}</span>
            {!isEditing && <FaPlus />}
          </motion.button>
        </form>
      </motion.div>

      {/* User Table */}
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">User List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left text-gray-600">Username</th>
                <th className="py-3 px-4 text-left text-gray-600">Email</th>
                <th className="py-3 px-4 text-left text-gray-600">Role</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{user.username}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.role}</td>
                  <td className="py-3 px-4 flex space-x-3">
                    <motion.button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Edit ${user.username}`}
                    >
                      <FaEdit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(user._id)}
                      className="text-red-600 hover:text-red-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Delete ${user.username}`}
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
                Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManagement;