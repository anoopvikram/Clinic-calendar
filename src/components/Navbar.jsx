import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };


  return (
    <div className="navbar">
      <h1 className="navbar-title">Clinic Appointment System</h1>
      <button onClick={handleSignOut} className="navbar-button">
        Sign Out
      </button>
    </div>
  );
};
