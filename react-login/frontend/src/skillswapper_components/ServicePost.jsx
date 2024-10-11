import React from "react";
import styles from './ServicePost.module.css';

function ServicePost({ username, date, content }) {
  return (
    <article className={styles.postContainer}>
      <header className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/048f52a746a81ff835713e646bc7e77cbf08441dab3c4ff2523672c4b7d64238?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d" className={styles.userAvatar} alt={`${username}'s avatar`} />
          <h2 className={styles.username}>{username}</h2>
        </div>
        <time className={styles.postDate}>{date}</time>
      </header>
      <p className={styles.postContent}>{content}</p>
    </article>
  );
}

export default ServicePost;