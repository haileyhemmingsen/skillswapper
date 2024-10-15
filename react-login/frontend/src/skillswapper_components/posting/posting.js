import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './posting.module.css';

import userAvatar from '../../images/user.svg';
import menuIcon from '../../images/3dots.svg';
import closeIcon from '../../images/exit.svg';

const Posting = (props) => {
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const samplePosts = [
    { id: 1, username: "Username", content: "comment replying and offering own service" },
    { id: 2, username: "Username", content: "comment replying and offering own service" },
    { id: 2, username: "Username", content: "comment replying and offering own service" },
    { id: 2, username: "Username", content: "comment replying and offering own service" },
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting comment:", comment);
    setComment('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.postContent}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <img src={userAvatar} alt="User avatar" className={styles.avatar} />
            <span className={styles.username}>Username</span>
          </div>
          <div className={styles.headerIcons}>
            <img src={menuIcon} alt="Menu" className={styles.icon} />
            <img src={closeIcon} alt="Close" className={styles.icon} />
          </div>
        </div>
        <div className={styles.content}>
          <p>I am seeking a service</p>
          <p>I can offer this other service</p>
          <p className={styles.additionalInfo}>additional information</p>
        </div>
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        className={styles.commentInput}
      />
      <button onClick={handleCommentSubmit} className={styles.commentButton}>
        Comment
      </button>
      <div className={styles.commentsSection}>
        <h3 className={styles.commentHeader}>comments</h3>
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