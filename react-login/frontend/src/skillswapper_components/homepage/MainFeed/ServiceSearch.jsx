import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './ServiceSearch.module.css';
import ServicePost from './ServicePost';
import searchImage from '../../../images/search.svg';
import logoImage from '../../../images/logo.svg';
import userImage from '../../../images/user.svg';
import ProfilePopup from '../../profile/ProfilePopup';
import dropdownImage from '../../../images/dropdown.svg'
import axios from 'axios'

// export const samplePosts = [
//   { id: 1, username: "Username1", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Sports", "Music"] },
//   { id: 2, username: "Username2", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Food"] },
//   { id: 3, username: "Username3", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Digital"] },
//   { id: 4, username: "Username4", date: "mm/dd/yyyy", content: "Seeking for...\nOffer...", categories: ["Handywork", "Sports"] },
// ];

export let samplePosts = undefined;

function ServiceSearch({ selectedCategories }) {
  const [showHeaderPopup, setShowHeaderPopup] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const headerPopupRef = useRef(null);
  const headerIconRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [samplePosts, setSamplePosts] = useState([]);
  const post = {
    desireSkills: 'body.desireSkills',
    haveSkills: 'body.haveSkills',
    description: 'body.description',
    categories: ['body.categories'],
  }

  const post_string = JSON.stringify(post);
  console.log(post_string);
  console.log(typeof(post_string))

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("selected categories: ", selectedCategories);
      const payload = { categories: ['useless'] };

      try {
        const response = await axios.post('http://localhost:3080/api/v0/getLocalPosts', 
          payload, 
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('logging response:');
        console.log("res.data: ", response.data);
        setSamplePosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedCategories]);

  const filteredPosts = selectedCategories.length === 0 
    ? samplePosts
    : samplePosts.filter(post =>
        post.categories.some(category => selectedCategories.includes(category))
      );

  const handleSortClick = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortOption = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
    
    const sortedPosts = [...samplePosts].sort((a, b) => {
      if (option === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    
    setSamplePosts(sortedPosts);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHeaderPopup &&
          headerPopupRef.current && 
          !headerPopupRef.current.contains(event.target) &&
          !headerIconRef.current.contains(event.target)) {
        setShowHeaderPopup(false);
      }

      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
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

  const handleMakePostClick = () => {
    navigate('/createpost');
  }

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
          
          <div className={styles.actionContainer}>
            <button type="button" className={styles.postButton} onClick={handleMakePostClick}>
              Make a post
            </button>
            <div className={`${styles.sortDropdownContainer}`} ref={sortDropdownRef}>
              <button 
                className={`${styles.sortButton} ${showSortDropdown ? styles.active : ''}`}
                onClick={handleSortClick}
              >
                <span>sort by</span>
                <img 
                  src={dropdownImage} 
                  alt="Sort options"
                  className={`${styles.dropdownIcon} ${showSortDropdown ? styles.rotated : ''}`}
                />
              </button>
              {showSortDropdown && (
                <div className={styles.sortOptions}>
                  <button 
                    onClick={() => handleSortOption('newest')}
                    className={styles.sortOption}
                  >
                    Newest
                  </button>
                  <button 
                    onClick={() => handleSortOption('oldest')}
                    className={styles.sortOption}
                  >
                    Oldest
                  </button>
                </div>
              )}
            </div>
          </div>

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