import React, { useEffect, useState, useRef } from 'react';
import styles from './ChatPage.module.css';
import Message from './Message';
import MessageInput from './MessageInput';
import userAvatar from '../../images/userAvatar.svg';
import axios from 'axios';

// const messages = [
//   { id: 1, sender: 'receiver', text: 'hellooo', avatar: userAvatar }, // Use the imported avatar
//   { id: 2, sender: 'user', text: 'hiiii', avatar: userAvatar }, // Use the same for consistency
//   { id: 3, sender: 'receiver', text: 'hellooo', avatar: userAvatar },
//   { id: 4, sender: 'receiver', text: 'hellooo', avatar: userAvatar },
// ];

function MessageList() {
    const [messages, setMessages] = useState([]);
    const chat_info_string = sessionStorage.getItem('chat_info');
    const chat_info = JSON.parse(chat_info_string);
    const user_id = sessionStorage.getItem('id');
    
    // set up variables to throttle api requests
    const intervalRef = useRef(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(async () => {
            const get_messages = async () => {
                const response = await axios.get('http://localhost:3080/api/v0/retrieveChatHistory', 
                    { headers: { "Content-Type": "application/json" }, 
                    params: { chat_id: chat_info.chat_id },
                    withCredentials: true
                    });
                console.log(response);
                const chat_data = response.data;
                const message_data = chat_data.messages;
                const message_result = message_data.map((message) => {
                    return {
                        sender: message.sender_name,
                        text: message.message,
                        avatar: userAvatar,
                        time: message.time_sent,
                        isUser: message.sender_id === user_id,
                        id: message.message_id
                    };
                });
                setMessages(message_result);
            }

            get_messages();
        }, 1000) // Throttle calls once every second
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [user_id, chat_info]);

  return (
    <section className={styles.messageList}>
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
      <MessageInput />
    </section>
  );
}

export default MessageList;
