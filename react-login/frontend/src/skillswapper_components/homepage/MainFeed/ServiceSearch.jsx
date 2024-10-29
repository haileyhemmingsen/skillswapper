import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './ServiceSearch.module.css';
import ServicePost from './ServicePost';
import searchImage from '../../../images/search.svg';
import logoImage from '../../../images/logo.svg';
import userImage from '../../../images/user.svg';
import ProfilePopup from '../../profile/ProfilePopup';

export const samplePosts = [
  { id: 1, username: "Username1", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Sports", "Music"] },
  { id: 2, username: "Username2", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Food"] },
  { id: 3, username: "Username3", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Digital"] },
  { id: 4, username: "Username4", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Handywork", "Sports"] },
];

function ServiceSearch({ selectedCategories }) {
  const [showHeaderPopup, setShowHeaderPopup] = useState(false);
  const headerPopupRef = useRef(null);
  const headerIconRef = useRef(null);
  const navigate = useNavigate();
  
  const filteredPosts = selectedCategories.length === 0 
    ? samplePosts
    : samplePosts.filter(post =>
        post.categories.some(category => selectedCategories.includes(category))
      );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHeaderPopup &&
          headerPopupRef.current && 
          !headerPopupRef.current.contains(event.target) &&
          !headerIconRef.current.contains(event.target)) {
        setShowHeaderPopup(false);
      }
    };

    if (showHeaderPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHeaderPopup]);

  const handleHeaderIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Header icon clicked');
    setShowHeaderPopup(!showHeaderPopup);
  };

  const handlePostClick = (postId) => {
    navigate(`/posting/${postId}`);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img loading="lazy" src={logoImage} className={styles.logoCompany} alt="Company logo" />
        <div ref={headerIconRef} className={styles.clickableUserArea}>
          <img 
            loading="lazy" 
            src={userImage} 
            className={styles.iconUser} 
            alt="User logo" 
            onClick={handleHeaderIconClick}
          />
          {showHeaderPopup && (
            <div ref={headerPopupRef} className={styles.headerPopupContainer}>
              <ProfilePopup 
                username="Username"
                isVisible={showHeaderPopup}
              />
            </div>
          )}
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
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => handlePostClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <ServicePost {...post} />
                </div>
              ))
            ) : (
              <p>No posts available for the selected categories.</p>
            )}
          </div>
        </section>
      </div> 
    </main>
  );
}

export default ServiceSearch;