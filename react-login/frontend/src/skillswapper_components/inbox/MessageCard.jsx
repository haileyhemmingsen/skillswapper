import React from 'react';
import styles from './MessageCard.module.css';
import unreadMessageDot from '../../images/unreadMessage.svg';
import { useNavigate } from 'react-router-dom';

export function MessageCard({ avatarSrc, username, message, read, timestamp, chat_id, receiver_id }) {
    const navigate = useNavigate();
    const clickedToNav = () => {
        const data = {
            chat_id: chat_id,
            receiver_id: receiver_id
        }
        const data_string = JSON.stringify(data);
        sessionStorage.setItem('chat_info', data_string);
        navigate(`/chat/${chat_id}`);
    }

  return (
    <div className={styles.messageWrapper} onClick={clickedToNav}>
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
