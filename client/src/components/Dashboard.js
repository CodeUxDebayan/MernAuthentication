import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    }
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  };
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

};

export default Dashboard;