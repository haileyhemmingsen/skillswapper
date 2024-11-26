import React, { useEffect, useState, useRef } from 'react';
import styles from './ChatPage.module.css';
import Message from './Message';
import userAvatar from '../../images/userAvatar.svg';
import axios from 'axios';

function MessageList() {
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null); // Ref for the scrollable container

  const chat_info_string = sessionStorage.getItem('chat_info');
  const chat_info = JSON.parse(chat_info_string);
  const user_id = sessionStorage.getItem('id');

  // Set up variables to throttle API requests
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
      };

      get_messages();
    }, 1000); // Throttle calls once every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user_id, chat_info]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className={styles.messageList} ref={messageListRef}>
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </section>
  );
}

export default MessageList;
