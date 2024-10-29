// /skillswapper_components/homepage/MainFeed/ServicePost.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from './ServicePost.module.css';
import userImage from '../../../images/user.svg';
import ProfilePopup from '../../profile/ProfilePopup';

function ServicePost({ username, date, content }) {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && 
          !popupRef.current.contains(event.target) &&
          !iconRef.current.contains(event.target)) {
        setIsProfileVisible(false);
      }
    };

    if (isProfileVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileVisible]);

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <div ref={iconRef} className={styles.iconWrapper}>
            <img 
              src={userImage}
              alt="User avatar" 
              className={styles.userAvatar}
              onClick={handleIconClick}
            />
            <div ref={popupRef} className={styles.popupContainer}>
              <ProfilePopup 
                username={username}
                isVisible={isProfileVisible}
              />
            </div>
          </div>
          <span className={styles.username}>{username}</span>
        </div>
        <span className={styles.postDate}>{date}</span>
      </div>
      
      <div className={styles.postContent}>
        {content.split('\n').map((line, index) => (
          <p key={index} className={styles.contentLine}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default ServicePost;