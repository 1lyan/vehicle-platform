import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userAPI } from '../api/users';

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
    <div>
      <h2>Users</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
        />
        <button type="submit">Create User</button>
      </form>

      <div>
        {users.map(user => (
          <div key={user.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;