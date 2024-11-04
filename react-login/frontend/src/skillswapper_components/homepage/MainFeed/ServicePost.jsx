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
        {line.split(/(Services Seeking: |Services Offering: )/gi).map((part, partIndex) => {
          if (part.match(/Services Seeking: |Services Offering: /gi)) {
            return <span key={partIndex}>{part}</span>;
          } else {
            return part.split(new RegExp(`(${keyword.split(' ').join('|')})`, 'gi')).map((subPart, subPartIndex) => (
              <span key={`${partIndex}-${subPartIndex}`}>
                {/* If the subPart matches any of the keywords, highlight it */}
                {keyword.split(' ').includes(subPart.toLowerCase()) ? (
                  <span className={styles.highlight}>{subPart}</span>
                ) : (
                  subPart // Otherwise, just render the subPart as is
                )}
              </span>
            ));
          }
        })}
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