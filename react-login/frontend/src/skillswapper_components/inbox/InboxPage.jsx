import React, { useState }from 'react';
import styles from './InboxPage.module.css';
import { MessageCard } from './MessageCard';
import userProfile from '../../images/userAvatar.svg';
import exit from '../../images/exit.svg';
import axios from 'axios';

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

function InboxPage() {
    const [chats, setChats] = useState([]); 
    try {
        const response = axios.get("http://localhost:3080/api/v0/retrieveChats", 
            { headers: { "Content-Type": "application/json" }, withCredentials: true });
        const chats = response.data;
        console.log(chats);
        if(chats.exists()) {
            // map function should preserve order
            const parsed_chats = chats.map(chat => {
                return {
                    username: chat.other_user_name,
                    chat_id: chat.id,
                    read: chat.read,
                    message: chat.recent_message,
                    timestamp: chat.time_sent
                }
            });
            setChats(parsed_chats);
        }
    }
    catch(error) {
        console.error(error);
    }

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