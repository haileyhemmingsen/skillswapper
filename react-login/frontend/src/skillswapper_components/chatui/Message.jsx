import React from 'react';
import styles from './ChatPage.module.css';

function Message({ sender, text, avatar }) {
  const isUser = sender === 'user';
  const messageClass = isUser ? styles.userMessage : styles.receiverMessage;
  const senderName = isUser ? 'Sender (User)' : 'Receiver';

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