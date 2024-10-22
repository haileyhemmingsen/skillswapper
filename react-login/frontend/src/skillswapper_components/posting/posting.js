import React, { useState } from 'react';
import styles from './posting.module.css';

import userAvatar from '../../images/user.svg';
import menuIcon from '../../images/3dots.svg';
import closeIcon from '../../images/backarrow.svg';

// import Kantumruy pro font
<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');
</style>

const Posting = (props) => {
  const [comment, setComment] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

const handleTextAreaResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
};

  const samplePosts = [
    { id: 1, username: "Username1", content: "shirin help" },
    { id: 2, username: "Username2", content: "shirin help" },
    { id: 3, username: "Username3", content: "shirin help" },
    { id: 4, username: "Username4", content: "shirin help" }
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting comment:", comment);
    setComment(''); 
    setIsInputFocused(false); 
  };

  return (
    <div className={styles.container}>
    <div className={styles.topIcons}>
      <img src={closeIcon} alt="Close" className={styles.arrowIcon} />
    </div>
    
    <div className={styles.postContent}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img src={userAvatar} alt="User avatar" className={styles.avatar} />
          <span className={styles.username}>Username</span>
        </div>
        <div className={styles.headerIcons}>
          <img src={menuIcon} alt="Menu" className={styles.icon} />
        </div>
      </div>
      <div className={styles.content}>
        <p>I am seeking a service</p>
        <p>I can offer this other service</p>
        <p className={styles.additionalInfo}>Additional information</p>
      </div>
    </div>

      <div style={{ position: 'relative' }}> {}
        <textarea
          type="text"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            handleTextAreaResize(e);  // dynamically resize as you type
          }}
          onFocus={() => setIsInputFocused(true)}
          
          onBlur={(e) => {
            // hide if button isnt clicked
            if (!e.relatedTarget || e.relatedTarget.className !== styles.commentButton) {
              setIsInputFocused(false);
            }
          }}
          placeholder="Add a comment"
          className={styles.commentInput}
        />
        <button
          onClick={handleCommentSubmit}
          className={`${styles.commentButton} ${isInputFocused ? styles.commentButtonVisible : ''}`}
        >
          Comment
        </button>
      </div>

      {}
      <div className={styles.commentsSection}>
        <h3 className={styles.commentHeader}>Comments</h3>
        {samplePosts.map((post) => (
          <div key={post.id} className={styles.comment}>
            <div className={styles.userInfo}>
              <img src={userAvatar} alt={`${post.username}'s avatar`} className={styles.avatar} />
              <span className={styles.username}>{post.username}</span>
            </div>
            <p className={styles.commentContent}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posting;
