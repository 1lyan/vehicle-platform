import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { vehicleAPI } from '../api/vehicles';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState({ make: '', model: '', year: '', userId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehicleAPI.create({
        make: formData.make,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : null,
        userId: parseInt(formData.userId)
      });
      setFormData({ make: '', model: '', year: '', userId: '' });
      loadVehicles();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Failed to create vehicle');
    } 
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleAPI.delete(id);
      await loadVehicles();
      alert('Vehicle deleted successfully!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  return (
    <div>
      <h2>Vehicles</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Make"
          value={formData.make}
          onChange={(e) => setFormData({...formData, make: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({...formData, model: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
        />
        <input
          type="number"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({...formData, userId: e.target.value})}
          required
        />
        
        <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '5px 15px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Vehicle'}
            </button>

      </form>

      <div>
        {vehicles.map(vehicle => (
          <div key={vehicle.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            <h3>{vehicle.make} {vehicle.model}</h3>
            <p>Year: {vehicle.year || 'N/A'}</p>
            <p>User ID: {vehicle.userId}</p>
            <p>Vehicle ID: {vehicle.id}</p>
            <button
                  onClick={() => handleDelete(vehicle.id!)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;