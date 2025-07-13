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
        </div>
        <div className='login-right'>
            <h2 className="right-heading">Clinic Appointment System</h2>
            <p className="right-subtext">Enter your credentials to continue:</p>
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="form-heading">Clinic Login</h2>

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
