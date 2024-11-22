import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './chatui.module.css';

const ChatComponent = ({ currentUser, otherUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatID, setChatID] = useState('');
//   const chatId = [currentUser.id, otherUser.id].sort().join('_'); // Unique chat ID for each user pair
    setChatID(sessionStorage.getItem('chat_id'));
//   get messages
  useEffect(() => {
    axios.post('http://localhost:3080/api/v0/unsubscribe', {
      data: 'hi'
    }).then((res) => {
      console.log(res);
    })
    return;
    // return unsubscribe; // Cleanup listener on component unmount
  }, [chatID]);

  const handleSendMessage = () => {

    const dto = {
        message: newMessage,
        sender: currentUser,
        receiver: otherUser,
        timestamp: Date(),
        chatID: chatID === "NewChat" ? undefined : chatID
    }
    axios.post('http://localhost:3080/api/v0/sendMessage',
        dto, 
        {headers: { "Content-Type": "application/json" }, 
        withCredentials: true, 
        params: {
            chat_id: chatID === "NewChat" ? undefined : chatID
        }}).then((res) => {
            console.log(res);
            setNewMessage(''); // Clear the input field
    });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <img src={otherUser.photoUrl} alt={otherUser.name} />
        <h2>{otherUser.name}</h2>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender.id === currentUser.id
                ? styles.sentMessage
                : styles.receivedMessage
            }
          >
            <img src={message.sender.photoUrl} alt={message.sender.name} />
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
