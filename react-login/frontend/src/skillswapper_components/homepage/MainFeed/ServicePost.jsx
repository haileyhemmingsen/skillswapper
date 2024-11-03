// /skillswapper_components/homepage/MainFeed/ServicePost.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from './ServicePost.module.css';
import userImage from '../../../images/user.svg';
import ProfilePopup from '../../profile/ProfilePopup';


function ServicePost({ username, date, content, keyword }) {
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

  const highlightedContent = keyword ? (
    content.split('\n').map((line, lineIndex) => (
      <p key={lineIndex} className={styles.contentLine}>
        {line.split(new RegExp(`(${keyword})`, 'gi')).map((part, partIndex) => (
          <span key={partIndex}>
            {/* If the part matches the keyword, highlight it */}
            {part.toLowerCase() === keyword.toLowerCase() ? (
              <span className={styles.highlight}>{part}</span>
            ) : (
              part // Otherwise, just render the part as is
            )}
          </span>
        ))}
      </p>
    ))
  ) : (
    <div>
      {content.split('\n').map((line, index) => (
        <p key={index} className={styles.contentLine}>{line}</p>
      ))}
    </div>
  );

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
        {highlightedContent}
      </div>
    </div>
  );
}

export default ServicePost;