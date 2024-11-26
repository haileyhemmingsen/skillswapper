import React from 'react';
import styles from './ChatPage.module.css';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatPage() {
  return (
    <main className={styles.chatPage}>
      <section className={styles.chatContainer}>
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </section>
    </main>
  );
}

export default ChatPage;
