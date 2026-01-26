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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Vehicles</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Make"
          value={formData.make}
          onChange={(e) => setFormData({...formData, make: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({...formData, model: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({...formData, userId: e.target.value})}
          required
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white w-max ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Creating...' : 'Create Vehicle'}
        </button>

      </form>

      <div className="space-y-3">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="border rounded p-4">
            <h3 className="text-lg font-medium">{vehicle.make} {vehicle.model}</h3>
            <p className="text-sm text-gray-600">Year: {vehicle.year || 'N/A'}</p>
            <p className="text-sm text-gray-600">User ID: {vehicle.userId}</p>
            <p className="text-sm text-gray-500">Vehicle ID: {vehicle.id}</p>
            <button
              onClick={() => handleDelete(vehicle.id!)}
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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