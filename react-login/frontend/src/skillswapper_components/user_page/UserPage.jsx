import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userImage from '../../images/user.svg';
import userGrayImage from '../../images/user_gray.svg';
import backArrow from '../../images/bubble_arrow.svg';
import editOrange from '../../images/edit_orange.svg';
import archiveOrange from '../../images/archive_orange.svg';
import editGray from '../../images/edit_gray.svg';
import archiveGray from '../../images/archive_gray.svg';
import styles from './UserPage.module.css';
import axios from 'axios';


function Post({ post, onArchiveToggle, editPost }) {
    const seeking = `Services Seeking: ${post.skillsAsked || 'N/A'}\n`;
    const offer = ` Services Offering: ${post.skillsOffered || 'N/A'}\n`;
    const description = post.description;
//   const [seeking, offer] = post.content.split('\n');
  
  return (
    <div className={`${styles.postContainer} ${post.archive ? styles.archivedPost : ''}`}>
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img 
            src={post.archive ? userGrayImage : userImage}
            alt="User avatar" 
            className={styles.userAvatar}
          />
          <span className={`${styles.username} ${post.archive ? styles.archivedText : ''}`}>
            {post.username}
          </span>
        </div>
        <div className={styles.postMeta}>
          <span className={`${styles.postDate} ${post.archive ? styles.archivedText : ''}`}>
            {new Date(post.date).toLocaleDateString()}
          </span>
          <img 
            src={post.archive ? editGray : editOrange}
            alt="Edit post" 
            className={styles.actionIcon}
            onClick={() => editPost(post)}
          />
        </div>
      </div>
      
      <div className={styles.postBody}>
        <div className={styles.contentLine}>
          <span className={`${styles.contentText} ${post.archive ? styles.archivedText : ''}`}>
            {seeking}
          </span>
          <img 
            src={post.archive ? archiveGray : archiveOrange}
            alt="Archive post" 
            className={styles.actionIcon}
            onClick={() => onArchiveToggle(post.id)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className={styles.contentLine}>
          <span className={`${styles.contentText} ${post.archive ? styles.archivedText : ''}`}>
            {offer}
          </span>
        </div>
        <div className={styles.contentLine}>
          <span className={`${styles.contentText} ${post.archive ? styles.archivedText : ''}`}>
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}

function UserPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3080/api/v0/getUserPosts",
                    { headers: {"Content-Type": "application/json"}, withCredentials: true });

                const posts = response.data;
                setPosts(posts);
            }
            catch (error) {
                console.error(error)
            }
        }
    fetchMyPosts();
    },[]);
    
//   setPosts(initialPosts);

const handleArchiveToggle = async (postId) => {
  try {
    // Update the UI immediately by setting the new archive state optimistically
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, archive: !post.archive } : post
      )
    );

    // Send the archive toggle request to the server
    const post = posts.find(post => post.id === postId);
    const dto = { archive: !post.archive, postID: post.id };
    
    const response = await axios.post(
      'http://localhost:3080/api/v0/ArchiveUpdate', 
      dto,
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    if (!response.data) {
      // Revert the change if the request fails on the server side
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, archive: post.archive } : post
        )
      );
    }
  } catch (error) {
    console.error(error);
    // Roll back the change if the request fails
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, archive: post.archive } : post
      )
    );
  }
};

const handleEditPost = async (post) => {
    console.log('edit post clicked');
    const string_post = JSON.stringify(post);
    sessionStorage.setItem('editPostData', string_post);
    navigate(`/editpost/${post.id}`);
}


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
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onArchiveToggle={handleArchiveToggle}
              editPost={handleEditPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserPage;