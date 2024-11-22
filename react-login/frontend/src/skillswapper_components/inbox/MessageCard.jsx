import React from 'react';
import styles from './MessageCard.module.css';

export function MessageCard({ avatarSrc, username, message }) {
  return (
    <article className={styles.messageCard}>
      <header className={styles.userInfo}>
        <img 
          src={avatarSrc} 
          alt={`${username}'s avatar`} 
          className={styles.userAvatar} 
          loading="lazy" 
        />
        <h2 className={styles.userName}>{username}</h2>
      </header>
      <p className={styles.messagePreview}>{message}</p>
    </article>
  );
}