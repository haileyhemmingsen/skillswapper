import React from 'react';
import styles from './MessageCard.module.css';
import unreadMessageDot from '../../images/unreadMessage.svg';

export function MessageCard({ avatarSrc, username, message, read, timestamp }) {
  return (
    <div className={styles.messageWrapper}>
      <div className={styles.iconPlaceholder}>
        {!read && (
          <img 
            src={unreadMessageDot} 
            alt="Unread message indicator" 
            className={styles.unreadDot} 
          />
        )}
      </div>
      <article className={styles.messageCard}>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <img 
              src={avatarSrc} 
              alt={`${username}'s avatar`} 
              className={styles.userAvatar} 
              loading="lazy" 
            />
            <h2 className={styles.userName}>{username}</h2>
          </div>
          <p className={styles.timestamp}>{timestamp}</p>
        </div>
        <p className={styles.messagePreview}>{message}</p>
      </article>
    </div>
  );
}
