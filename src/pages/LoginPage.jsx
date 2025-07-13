import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'staff@clinic.com' && password === '123456') {
      navigate('/calendar');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
        <div className="login-left">
            <h2 className="login-heading">Clinic Appointment System</h2>
            <p className="login-subtext">Manage doctor appointments with ease.</p>
            <div className='mt-10 bg-[#ffffff24] border-sky-300 border-2 p-5 rounded-4xl shadow-2xl'>
              <p class="mb-4 text-xl text-gray-700">
                How to use this clinic appointment system:
              </p>
              <ul class="list-disc pl-6 text-base text-black space-y-1">
                <li>Login using your staff credentials on the login page.</li>
                <li>Use the calendar view to browse appointments by day or month.</li>
                <li>Click on an empty date to create a new appointment.</li>
                <li>Select a patient, doctor, and appointment time in the form modal.</li>
                <li>Click on an existing appointment to edit or delete it.</li>
                <li>Use the filters above the calendar to view specific doctors or patients.</li>
                <li>On mobile, swipe up/down or use the date picker to navigate dates.</li>
                <li>Appointments are saved locally and will persist on page reload.</li>
              </ul>
            </div>
        </div>
        <div className='login-right'>
            <h2 className="right-heading">Clinic Appointment System</h2>
            <p className="right-subtext">Enter your credentials to continue:</p>
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="form-heading">Clinical Login</h2>

                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    </div>
  );
};
