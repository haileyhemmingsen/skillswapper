import React from 'react';
import styles from './ChatPage.module.css';
import sendButton from '../../images/sendButton.svg';



function MessageInput() {
  return (
    <form className={styles.messageInputForm}>
      <div className={styles.messageInputWrapper}>
        <input
          type="text"
          id="messageInput"
          className={styles.messageInput}
          placeholder="Type..."
          aria-label="Type a message"
        />
        <button type="submit" className={styles.sendButton}>
          <img src={sendButton} alt="Send button" />
        </button>
      </div>
</form>

  );
}

export default MessageInput;