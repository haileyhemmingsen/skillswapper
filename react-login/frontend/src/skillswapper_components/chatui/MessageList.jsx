import React from 'react';
import styles from './ChatPage.module.css';
import Message from './Message';
import MessageInput from './MessageInput';
import userAvatar from '../../images/userAvatar.svg';

const messages = [
  { id: 1, sender: 'receiver', text: 'hellooo', avatar: userAvatar }, // Use the imported avatar
  { id: 2, sender: 'user', text: 'hiiii', avatar: userAvatar }, // Use the same for consistency
  { id: 3, sender: 'receiver', text: 'hellooo', avatar: userAvatar },
  { id: 4, sender: 'receiver', text: 'hellooo', avatar: userAvatar },
];

function MessageList() {
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
