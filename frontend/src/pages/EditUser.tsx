import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userAPI } from '../api/users';

const EditUser: React.FC = (props: {id: number}) => {
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await userAPI.getById(props.id);
      setFormData({ email: data.email, firstName: data.firstName, lastName: data.lastName});
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.update(props.id, formData);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <h2>User</h2>
      
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
        <button type="submit">Update</button>
      </form>

    </div>
  );
};

export default EditUser;