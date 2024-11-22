import React from 'react';
import styles from './InboxPage.module.css';
import { MessageCard } from './MessageCard';
import userProfile from '../../images/userAvatar.svg';
import exit from '../../images/exit.svg';

// hard coded chats for now
const messages = [
  {
    avatarSrc: userProfile,
    username: "Username",
    message: "Hey I'm interested in your service...."
  },
  {
    avatarSrc: userProfile,
    username: "Username",
    message: "Hey I'm interested in your service...."
  },
  {
    avatarSrc: userProfile,
    username: "Username",
    message: "Hey I'm interested in your service...."
  },
  {
    avatarSrc: userProfile,
    username: "Username",
    message: "Hey I'm interested in your service...."
  }
];

export function InboxPage() {
  return (
    <main className={styles.inboxContainer}>
      <img 
        src= {exit}
        alt="Settings" 
        className={styles.exitIcon} 
        loading="lazy" 
      />
      
      <section className={styles.headerSection}>
        <header className={styles.userHeader}>
          <img 
            src= {userProfile}
            alt="User profile" 
            className={styles.userAvatar} 
            loading="lazy" 
          />
          <h1 className={styles.userName}>Username</h1>
        </header>
        <h2 className={styles.inboxTitle}>Inbox</h2>
      </section>

      <section className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            avatarSrc={message.avatarSrc}
            username={message.username}
            message={message.message}
          />
        ))}
      </section>
    </main>
  );
}

export default InboxPage;