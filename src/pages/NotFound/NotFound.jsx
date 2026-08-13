import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../components/Button/Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('role');

  const handleReturn = () => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <div className="notfound-icon-wrapper">
          <Compass size={40} />
        </div>
        <div className="notfound-titles">
          <h1 className="notfound-title">404</h1>
          <h2 className="notfound-subtitle">Page Not Found</h2>
          <p className="notfound-desc">
            The page you are looking for does not exist, has been removed, or is restricted to different user permissions.
          </p>
        </div>
        <Button variant="primary" onClick={handleReturn} className="notfound-action-btn">
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
