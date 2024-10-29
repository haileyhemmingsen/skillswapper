import React from 'react';
import { Link } from 'react-router-dom';
import userImage from '../../images/user.svg';
import backArrow from '../../images/bubble_arrow.svg';
import styles from './UserPage.module.css';

const samplePosts = [
  { id: 1, username: "Username1", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 2, username: "Username2", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 3, username: "Username3", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 4, username: "Username4", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 5, username: "Username5", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." }
];

function Post({ username, date, content }) {
  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img 
            src={userImage}
            alt="User avatar" 
            className={styles.userAvatar}
          />
          <span className={styles.username}>{username}</span>
        </div>
        <span className={styles.postDate}>{date}</span>
      </div>
      
      <div className={styles.postContent}>
        {content.split('\n').map((line, index) => (
          <p key={index} className={styles.contentLine}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function UserPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileSection}>
        <Link to="/homepage" className={styles.backLink}>
          <img 
            src={backArrow} 
            alt="Back to homepage" 
            className={styles.backArrow}
          />
        </Link>
        <img 
          src={userImage} 
          alt="Profile" 
          className={styles.profileAvatar}
        />
        <h1 className={styles.profileUsername}>Username</h1>
      </div>

      <div className={styles.archiveSection}>
        <h2 className={styles.archiveTitle}>My Posts</h2>
        <div className={styles.postsContainer}>
          {samplePosts.map(post => (
            <Post
              key={post.id}
              username={post.username}
              date={post.date}
              content={post.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPage;