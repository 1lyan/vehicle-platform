import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';
import EditUser from './pages/EditUser';
import Vehicles from './pages/Vehicles';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>
          <Link to="/vehicles">Vehicles</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<div><h1>Vehicle Service Platform</h1><p>Welcome to the platform!</p></div>} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<EditUser id={window.location.href.split('/')[4]}/>} />
          <Route path="/vehicles" element={<Vehicles />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;