import React from 'react';
import styles from './ChatPage.module.css';
import { Link } from 'react-router-dom';
import userAvatar from '../../images/userAvatar.svg';
import exit from '../../images/exit.svg';

function ChatHeader() {
  return (
    <header className={styles.chatHeader}>
      <img src={userAvatar} alt="Receiver's avatar" className={styles.avatar} />
      <h2 className={styles.receiverName}>Receiver</h2>
      <Link to="/homepage" className={styles.exitLink}>
        {' '}
        {/* Wrap the exit button with Link */}
        <img src={exit} alt="Exit icon" className={styles.menuIcon} />
      </Link>
    </header>
  );
}

export default ChatHeader;
