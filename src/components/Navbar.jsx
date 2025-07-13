import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = () => {
    navigate('/');
  };

  useEffect(() => {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') setDarkMode(true);
}, []);

useEffect(() => {
  localStorage.setItem('darkMode', darkMode);
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

  return (
    <div className="navbar">
      <h1 className="navbar-title">Clinic Appointment System</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-white text-sky-700 px-4 py-1.5 rounded-full font-semibold hover:bg-sky-100 transition"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <button onClick={handleSignOut} className="navbar-button">
        Sign Out
      </button>
    </div>
  );
};
