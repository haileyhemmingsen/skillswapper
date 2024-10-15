import React from "react";
import styles from './ServicePost.module.css';
import userImage from '../../../images/user.svg';

function ServicePost({ username, date, content }) {
  return (
    <article className={styles.postContainer}>
      <header className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img loading="lazy" src={userImage} className={styles.userAvatar} alt={`${username}'s avatar`} />
          <h2 className={styles.username}>{username}</h2>
        </div>
        <time className={styles.postDate}>{date}</time>
      </header>
      <p className={styles.postContent}>{content}</p>
    </article>
  );
}

export default ServicePost;
