import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfilePopup.module.css';
import profileImage from '../../images/profile_light.svg';

const ProfilePopup = ({ username, isVisible }) => {
  if (!isVisible) return null;
  
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
        <Link 
          to="/userpage" 
          className={styles.linkReset}
          onClick={(e) => {
            e.stopPropagation();
            console.log('View Profile clicked');
          }}
        >
          <button className={styles.actionBtn}>
            View Profile
          </button>
        </Link>
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