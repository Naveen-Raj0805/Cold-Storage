import React from 'react';
import { Mail, Phone, MapPin, Building } from 'lucide-react';
import './ProfileCard.css';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-card-container">
      <img
        src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
        alt={user.name}
        className="profile-card-avatar"
      />
      <div className="profile-card-ident">
        <h3 className="profile-card-name">{user.name}</h3>
        <span className="profile-card-role-badge">{user.role}</span>
      </div>

      <div className="profile-card-details">
        <div className="profile-card-detail-item">
          <span className="profile-card-detail-icon">
            <Mail size={16} />
          </span>
          <span className="profile-card-detail-value">{user.email}</span>
        </div>

        <div className="profile-card-detail-item">
          <span className="profile-card-detail-icon">
            <Phone size={16} />
          </span>
          <span className="profile-card-detail-value">{user.phone || 'No phone provided'}</span>
        </div>

        {user.farmName && (
          <div className="profile-card-detail-item">
            <span className="profile-card-detail-icon">
              <Building size={16} />
            </span>
            <span className="profile-card-detail-value">{user.farmName}</span>
          </div>
        )}

        {user.location && (
          <div className="profile-card-detail-item">
            <span className="profile-card-detail-icon">
              <MapPin size={16} />
            </span>
            <span className="profile-card-detail-value">{user.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
