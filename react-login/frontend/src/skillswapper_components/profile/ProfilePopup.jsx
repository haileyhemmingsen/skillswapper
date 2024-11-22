import React from 'react';
import styles from './ProfilePopup.module.css';
import profileImage from '../../images/profile_light.svg';
import { useNavigate } from 'react-router-dom';

const ProfilePopup = ({ username, isVisible }) => {
    const navigate = useNavigate();
    if (!isVisible) {
        return null;
    }
    console.log('username:' + username);
  
  
  return (
    <div className={styles.profilePopup}>
      <div className={styles.userInfo}>
        <div className={styles.avatarContainer}>
          <img 
            src={profileImage}
            alt="Profile" 
            className={styles.userAvatar} 
          />
        </div>
      </div>
      <span className={styles.username}>{username}</span>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            console.log('View Profile clicked');
            navigate('/userpage');
          }}
        >
          View Profile
        </button>
        <button 
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Logout clicked');
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;