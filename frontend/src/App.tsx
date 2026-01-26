import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';
import EditUser from './pages/EditUser';
import Vehicles from './pages/Vehicles';

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-5">
        <nav className="mb-5">
          <Link to="/" className="mr-4 text-blue-600 hover:underline">Home</Link>
          <Link to="/users" className="mr-4 text-blue-600 hover:underline">Users</Link>
          <Link to="/vehicles" className="text-blue-600 hover:underline">Vehicles</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Vehicle Service Platform</h1>
                <p className="text-gray-700">Welcome to the platform!</p>
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<EditUser id={window.location.href.split('/')[4]}/>} />
          <Route path="/vehicles" element={<Vehicles />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;