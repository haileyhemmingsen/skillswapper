import React, { useEffect, useState }from 'react';
import styles from './InboxPage.module.css';
import { MessageCard } from './MessageCard';
import userProfile from '../../images/userAvatar.svg';
import backArrow from '../../images/bubble_arrow.svg';
import axios from 'axios';
import { Link } from "react-router-dom";
import { LoginContext } from '../../context/Login.tsx';


function InboxPage() {
    const [chats, setChats] = useState([]); 
    const loginContext = React.useContext(LoginContext);
    let username;
    if (`${loginContext.userLastName}` === '') {
        username = `${loginContext.userFirstName}`;
    }
    else {
        username = `${loginContext.userFirstName} ${loginContext.userLastName}`;
    }

    useEffect(() => {
        const fetch_chats = async () => {
            try {
                const response = await axios.get("http://localhost:3080/api/v0/retrieveChats", 
                    { headers: { "Content-Type": "application/json" }, withCredentials: true });
                const chats = response.data;
                console.log(chats);
                if(chats !== undefined) {
                    // map function should preserve order
                    const parsed_chats = chats.map(chat => {
                        const date = new Date(chat.time_sent.seconds * 1000);
                        return {
                            username: chat.other_user_name,
                            other_user_id: chat.other_user_id,
                            chat_id: chat.id,
                            read: chat.read,
                            message: chat.recent_message,
                            timestamp: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.toLocaleTimeString()}`,
                            avatarSrc: userProfile
                        }
                    });
                    setChats(parsed_chats);
                }
            }
            catch(error) {
                console.error(error);
            }
        }
        fetch_chats();
    }, []);
   
  return (
    <main className={styles.inboxContainer}>
      <Link to="/homepage" className={styles.exitIconContainer}>
        <img 
          src={backArrow} 
          alt="Settings" 
          className={styles.backIcon} 
          loading="lazy" 
        />
    </Link>
      
    <section className={styles.headerSection}>
      <div className={styles.headerUserInfo}>
        <img 
          src={userProfile}
          alt="User profile" 
          className={styles.userAvatar} 
          loading="lazy" 
        />
        <h1 className={styles.userName}>{username}</h1>
      </div>
    <h2 className={styles.inboxTitle}>Inbox</h2>
  </section>

      <section className={styles.messagesContainer}>
        {chats.map((message, index) => (
          <MessageCard
            key={index}
            avatarSrc={message.avatarSrc}
            username={message.username}
            message={message.message}
            timestamp={message.timestamp}
            read={message.read}
            chat_id={message.chat_id}
            receiver_id={message.other_user_id}
          />
        ))}
      </section>
    </main>
  );
}

export default InboxPage;