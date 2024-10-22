import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './ServiceSearch.module.css';
import ServicePost from './ServicePost';
import searchImage from '../../../images/search.svg';
import logoImage from '../../../images/logo.svg';
import userImage from '../../../images/user.svg';

const samplePosts = [
  { id: 1, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 2, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 3, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 4, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
];

function ServiceSearch() {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate('/posting');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img loading="lazy" src={logoImage} className={styles.logoCompany} alt="Company logo" />
        <div className={styles.clickableUserArea}>
          <img loading="lazy" src={userImage} className={styles.iconUser} alt="User logo" />
        </div>
      </header>
      <div className={styles.mainContent}>
        <section className={styles.searchSection}>
          <h1 className={styles.searchTitle}>What service are you looking for?</h1>
          <form>
            <label htmlFor="serviceSearch" className={styles['visually-hidden']}>Search for services</label>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                id="serviceSearch"
                className={styles.searchInput}
                placeholder="Type keywords here..."
                aria-label="Search for services"
              />
              <div className={styles.clickableSearchArea}>
                <img loading="lazy" src={searchImage} alt="Search icon" className={styles.searchIcon} />
              </div>
            </div>
          </form>
          <button type="button" className={styles.postButton}>Make a post</button>
          <div className={styles.postsContainer}>
            {samplePosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <ServicePost {...post} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ServiceSearch;