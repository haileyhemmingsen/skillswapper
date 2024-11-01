import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceSearch.module.css";
import ServicePost from "./ServicePost";
import searchImage from "../../../images/search.svg";
import logoImage from "../../../images/logo.svg";
import userImage from "../../../images/user.svg";
import ProfilePopup from '../../profile/ProfilePopup';
import axios from "axios";

export const samplePosts = [];

function ServiceSearch({ selectedCategories }) {
  const [showHeaderPopup, setShowHeaderPopup] = useState(false);
  const headerPopupRef = useRef(null);
  const headerIconRef = useRef(null);
  const navigate = useNavigate();

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

  const [posts, setPosts] = useState(samplePosts); 

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("selected categories: ", selectedCategories);
      const payload = { categories: selectedCategories.length > 0 ? selectedCategories : ['useless'] };
    
      try {
        const response = await axios.post(
          "http://localhost:3080/api/v0/getLocalPosts",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Response data:", response.data); 
    
        const posts = response.data; 
        const parsedPosts = posts.map(post => {
          return {
            post_id: post.id,
            username: post.username,
            date: new Date(post.date).toLocaleDateString(),
            content: 
              `Services Seeking: ${post.skillsAsked || 'N/A'}\n` +
              `Services Offering: ${post.skillsOffered || 'N/A'}\n` +
              `${post.description ? `${post.description}` : ''}`,
            categories: post.categories || []
          };
        });     
        
        setPosts(parsedPosts); 
        samplePosts.push(...parsedPosts); 
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedCategories]);

  const filteredPosts =
    selectedCategories.length === 0
      ? posts
      : posts.filter((post) =>
          post.categories.some((category) => selectedCategories.includes(category))
        );

  const handlePostClick = (postId) => {
    navigate(`/posting/${postId}`);
  };


  const handleMakePostClick = () => {
    navigate("/createpost");
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
            <label htmlFor="serviceSearch" className={styles["visually-hidden"]}>Search for services</label>
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
          <button type="button" className={styles.postButton} onClick={handleMakePostClick}>Make a post</button>
          <div className={styles.postsContainer}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.post_id}
                  onClick={() => handlePostClick(post.post_id)}
                  style={{ cursor: "pointer" }}
                >
                  <ServicePost 
                    username={post.username} 
                    date={post.date} 
                    content={post.content} 
                  />
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
