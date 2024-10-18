import React from "react";
import styles from './ServicePost.module.css';
import userImage from '../../../images/user.svg';

function ServicePost({ username, date, content }) {
  const contentLines = content.split('\n');
  return (
    <article className={styles.postContainer}>
      <header className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img loading="lazy" src={userImage} className={styles.userAvatar} alt={`${username}'s avatar`} />
          <p className={styles.username}>{username}</p>
        </div>
        <time className={styles.postDate}>{date}</time>
      </header>
      <div className={styles.postContent}>
        {contentLines.map((line, index) => (
          <p key={index} className={styles.contentLine}>{line}</p>
        ))}
      </div>    
    </article>
  );
}

export default ServicePost;
