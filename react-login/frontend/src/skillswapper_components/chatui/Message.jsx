import React from 'react';
import styles from './ChatPage.module.css';

function Message({ isUser, sender, text, avatar }) {
  const messageClass = isUser ? styles.userMessage : styles.receiverMessage;
  const senderName = `${sender}`;

  return (
    <article className={messageClass}>
      <div className={styles.messageHeader}>
        <img src={avatar} alt={`${senderName}'s avatar`} className={styles.messageAvatar} />
        <span className={styles.senderName}>{senderName}</span>
      </div>
      <p className={styles.messageText}>{text}</p>
    </article>
  );
}

export default Message;