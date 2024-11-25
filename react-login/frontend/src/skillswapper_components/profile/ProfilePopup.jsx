import React from 'react';
import styles from './ProfilePopup.module.css';
import profileImage from '../../images/profile_light.svg';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/Login.tsx';
import axios from 'axios'


const ProfilePopup = ({ username, isVisible }) => {
  const loginContext = React.useContext(LoginContext);
  const navigate = useNavigate();
  if (!isVisible) {
      return null;
  }
  console.log('username:' + username);

  const logout = async () => {
    loginContext.setLoggedIn(false);
    // Trigger the logout API
    await axios.post('http://localhost:3080/api/v0/logout', {}, { withCredentials: true });
    // Clear sessionStorage
    sessionStorage.clear();
    loginContext.setUserFirstName('');
    loginContext.setUserLastName('');
    loginContext.setId('');
    loginContext.setZip('');
    navigate('/login');
  }
  
  
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
            logout();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;