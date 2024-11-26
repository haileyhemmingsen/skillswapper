import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './chatui.module.css';
import { LoginContext } from "../../../context/Login.tsx";

const ChatComponent = ({ currentUser, otherUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatID, setChatID] = useState('');
    // const [receiverID, setReceiverID] = useState('');

    // const loginContext = React.useContext(LoginContext);


//   const chatId = [currentUser.id, otherUser.id].sort().join('_'); // Unique chat ID for each user pair
    // setChatID(sessionStorage.getItem('chat_id'));


    // const chat_info_string = sessionStorage.getItem('chat_info');
    // const chat_info = JSON.parse(chat_info_string);
    // setChatID(chat_info.chat_id);
    // setReceiverID(chat_info.receiver_id);
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
    console.log('calling handle send message');
    // const dto = {
    //     message: newMessage,
    //     sender: loginContext.id,
    //     receiver: receiverID,
    //     timestamp: Date(),
    //     chatID: chatID === "NewChat" ? undefined : chatID
    // }
    // console.log(dto);
    // axios.post('http://localhost:3080/api/v0/sendMessage',
    //     dto, 
    //     {headers: { "Content-Type": "application/json" }, 
    //     withCredentials: true, 
    //    }).then((res) => {
    //         console.log(res);
    //         const response_string = JSON.stringify(res)
    //         sessionStorage.setItem('chatreponsemessge', response_string);
    //         setNewMessage(''); // Clear the input field
    // });
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
