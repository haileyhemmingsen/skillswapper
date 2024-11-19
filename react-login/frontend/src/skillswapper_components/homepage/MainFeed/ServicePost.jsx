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

  const highlightText = (text, keyword) => {
    // Split the input keyword string by spaces to handle multiple keywords
    const keywords = keyword.split(' ').filter(Boolean); // filter(Boolean) removes empty strings
  
    const lines = text.split('\n');
    const highlightedLines = lines.map((line) => {
      const words = line.split(' ');
      const highlightedWords = words.map((word) => {
        const lowerCaseWord = word.toLowerCase();
        const matchingKeyword = keywords.find(keyword => lowerCaseWord.includes(keyword.toLowerCase()));
  
        if (matchingKeyword) {
          const parts = word.split(new RegExp(`(${matchingKeyword})`, 'gi'));
          return parts.map((part, index) => (
            <span key={index} className={index % 2 === 1 ? styles.highlight : ''}>
              {part}
            </span>
          ));
        } else {
          return word;
        }
      });
      return (
        <p key={line} className={styles.contentLine}>
          {highlightedWords.map((word, index) => (
            <span key={index}>{word}{index < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
      );
    });
  
    return highlightedLines;
  };

  const highlightedContent = highlightText(content, keyword);

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
            {/* here would be where each OTHER user's icon will be clicked and 
            reroute to THEIR profile */}
            {/* <div ref={popupRef} className={styles.popupContainer}>
              <ProfilePopup 
                username={username}
                isVisible={isProfileVisible}
              />
            </div> */}
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