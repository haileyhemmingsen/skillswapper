import React, { useState, useRef, useEffect } from 'react';
import styles from './ServicePost.module.css';
import userImage from '../../../images/user.svg';
// import ProfilePopup from '../../profile/ProfilePopup';

function ServicePost({ username, date, content, keyword }) {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
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
    const keywords = keyword.split(' ').filter(Boolean); // Extract keywords
    const lines = text.split('\n'); // Split content into lines

    const highlightedLines = lines.map((line, index) => {
      // Check if the line starts with the specified prefixes
      const isSeekingLine = line
        .trim()
        .toLowerCase()
        .startsWith('services seeking:');
      const isOfferingLine = line
        .trim()
        .toLowerCase()
        .startsWith('services offering:');

      let prefix = '';
      let content = line;

      // Separate the prefix from the line content
      if (isSeekingLine) {
        prefix = 'Services Seeking: ';
        content = line.substring(prefix.length).trim();
      } else if (isOfferingLine) {
        prefix = 'Services Offering: ';
        content = line.substring(prefix.length).trim();
      }

      // Highlight the content excluding the prefix
      const words = content.split(' ');
      const highlightedWords = words.map((word) => {
        const lowerCaseWord = word.toLowerCase();
        const matchingKeyword = keywords.find((kw) =>
          lowerCaseWord.includes(kw.toLowerCase())
        );

        if (matchingKeyword) {
          const parts = word.split(new RegExp(`(${matchingKeyword})`, 'gi'));
          return parts.map((part, partIndex) => (
            <span
              key={partIndex}
              className={partIndex % 2 === 1 ? styles.highlight : ''}
            >
              {part}
            </span>
          ));
        } else {
          return word;
        }
      });

      return (
        <p key={index} className={styles.contentLine}>
          {prefix}
          {highlightedWords.map((word, wordIndex) => (
            <span key={wordIndex}>
              {word}
              {wordIndex < words.length - 1 ? ' ' : ''}
            </span>
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

      <div className={styles.postContent}>{highlightedContent}</div>
    </div>
  );
}

export default ServicePost;
