import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userAPI } from '../api/users';
import { Link } from 'react-router-dom';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.create(formData);
      setFormData({ email: '', firstName: '', lastName: '' });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 w-max">Create User</button>
      </form>

      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="border rounded p-4">
            <h3 className="text-lg font-medium">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
            <div className="mt-3">
              <Link to={`/users/${user.id}`} className="text-blue-600 hover:underline">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;