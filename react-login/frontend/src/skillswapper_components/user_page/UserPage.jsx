import React from 'react';
import { Link } from 'react-router-dom';
import userImage from '../../images/user.svg';
import userGrayImage from '../../images/user_gray.svg';
import backArrow from '../../images/bubble_arrow.svg';
import editOrange from '../../images/edit_orange.svg';
import archiveOrange from '../../images/archive_orange.svg';
import editGray from '../../images/edit_gray.svg';
import archiveGray from '../../images/archive_gray.svg';
import styles from './UserPage.module.css';

const samplePosts = [
  { id: 1, username: "Username1", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", isArchived: false },
  { id: 2, username: "Username2", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", isArchived: true },
  { id: 3, username: "Username3", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", isArchived: false },
  { id: 4, username: "Username4", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", isArchived: false },
  { id: 5, username: "Username5", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", isArchived: false }
];

function Post({ username, date, content, isArchived }) {
  const [seeking, offer] = content.split('\n');
  
  return (
    <div className={`${styles.postContainer} ${isArchived ? styles.archivedPost : ''}`}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img 
            src={isArchived ? userGrayImage : userImage}
            alt="User avatar" 
            className={styles.userAvatar}
          />
          <span className={`${styles.username} ${isArchived ? styles.archivedText : ''}`}>
            {username}
          </span>
        </div>
        <div className={styles.postMeta}>
          <span className={`${styles.postDate} ${isArchived ? styles.archivedText : ''}`}>
            {date}
          </span>
          <img 
            src={isArchived ? editGray : editOrange}
            alt="Edit post" 
            className={styles.actionIcon}
          />
        </div>
      </div>
      
      <div className={styles.postBody}>
        <div className={styles.contentLine}>
          <span className={`${styles.contentText} ${isArchived ? styles.archivedText : ''}`}>
            {seeking}
          </span>
          <img 
            src={isArchived ? archiveGray : archiveOrange}
            alt="Archive post" 
            className={styles.actionIcon}
          />
        </div>
        <div className={styles.contentLine}>
          <span className={`${styles.contentText} ${isArchived ? styles.archivedText : ''}`}>
            {offer}
          </span>
        </div>
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
              isArchived={post.isArchived}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPage;