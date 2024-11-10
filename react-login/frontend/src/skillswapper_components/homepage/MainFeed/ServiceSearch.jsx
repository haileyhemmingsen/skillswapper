import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceSearch.module.css";
import ServicePost from "./ServicePost";
import searchImage from "../../../images/search.svg";
import logoImage from "../../../images/logo.svg";
import userImage from "../../../images/user.svg";
import dropdownImage from "../../../images/dropdown.svg";
import ProfilePopup from '../../profile/ProfilePopup';
import axios from "axios";

import { LoginContext } from "../../../context/Login.tsx";

export const samplePosts = [];

function ServiceSearch({ selectedCategories }) {
  const [showHeaderPopup, setShowHeaderPopup] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const headerPopupRef = useRef(null);
  const headerIconRef = useRef(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState(samplePosts); 
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // New state for sort order
  const [sortLabel, setSortLabel] = useState("sort by"); // New state for sort button label

  const loginContext = React.useContext(LoginContext);

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
  }, [showHeaderPopup, showSortDropdown]);

  const handleHeaderIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Header icon clicked');
    setShowHeaderPopup(!showHeaderPopup);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("selected categories: ", selectedCategories);
      const payload = { categories: selectedCategories.length > 0 ? selectedCategories : [] };
    
      try {
        const response = await axios.post(
          "http://localhost:3080/api/v0/getLocalPosts",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Response data:", response.data); 
    
        const posts = response.data; 
        const parsedPosts = posts.map(post => {
            if (post.username === ' ') {
                return {
                    post_id: post.id,
                    username: post.poster_uuid,
                    date: new Date(post.date).toLocaleDateString(),
                    content: 
                        `Services Seeking: ${post.skillsAsked || 'N/A'}\n` +
                        `Services Offering: ${post.skillsOffered || 'N/A'}\n` +
                        `${post.description ? `${post.description}` : ''}`,
                    categories: post.categories || []
              };
            }
            else {
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
            }
        });     
        
        setPosts(parsedPosts); 
        samplePosts.length = 0; //clearing the array
        samplePosts.push(...parsedPosts); 
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedCategories]);

  const filteredPosts = posts
    .filter((post) => {
      const includesKeyword = post.content.toLowerCase().includes(keyword.toLowerCase());
      if (selectedCategories.length === 0) {
        return includesKeyword;
      } else {
        const includesCategory = post.categories.some((category) =>
          selectedCategories.includes(category)
        );
        return includesCategory && includesKeyword;
      }
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOrder === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  const handlePostClick = (post) => {
    // send post data to session storage
    const string_post = JSON.stringify(post);
    sessionStorage.setItem('postInfo', string_post);
    navigate(`/posting/${post.post_id}`);
  };

  const handleMakePostClick = () => {
    navigate("/createpost");
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleSortClick = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortOption = (option) => {
    console.log("Selected sort option:", option);
    setSortOrder(option);
    setSortLabel(`sort by ${option}`); // Update the button label
    setShowSortDropdown(false);
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
                username={loginContext.userName}
                isVisible={showHeaderPopup}
              />
            </div>
          )}
        </div>
      </header>
      <div className={styles.mainContent}>
        <section className={styles.searchSection}>
          <h1 className={styles.searchTitle}>What service are you looking for?</h1>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="serviceSearch" className={styles["visually-hidden"]}>Search for services</label>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                id="serviceSearch"
                className={styles.searchInput}
                placeholder="Type keywords here..."
                aria-label="Search for services"
                value={keyword}
                onChange={handleSearchChange}
              />
              <div className={styles.clickableSearchArea}>
                <img loading="lazy" src={searchImage} alt="Search icon" className={styles.searchIcon} />
              </div>
            </div>
          </form>
          <div className={styles.actionContainer}>
            <button type="button" className={styles.postButton} onClick={handleMakePostClick}>Make a post</button>
            <div className={styles.sortDropdownContainer} ref={sortDropdownRef}>
              <button className={styles.sortButton} onClick={handleSortClick}>
                {sortLabel}
                <img 
                  src={dropdownImage} 
                  alt="Sort options" 
                  className={`${styles.dropdownIcon} ${showSortDropdown ? styles.flipIcon : ''}`}
                />
              </button>
              {showSortDropdown && (
                <div className={styles.sortOptions}>
                  <button className={styles.sortOption} onClick={() => handleSortOption('newest')}>Newest</button>
                  <button className={styles.sortOption} onClick={() => handleSortOption('oldest')}>Oldest</button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.postsContainer}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.post_id}
                  onClick={() => handlePostClick(post)}
                  style={{ cursor: "pointer" }}
                >
                  <ServicePost
                    username={post.username}
                    date={post.date}
                    content={post.content}
                    keyword={keyword} 
                  />
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ServiceSearch;