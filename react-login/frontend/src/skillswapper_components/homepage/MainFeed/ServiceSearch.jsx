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
import { getDistanceByZip } from "../../../utils/zipcodeUtils"; 

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
  const [sortOrder, setSortOrder] = useState(""); 
  const [sortLabel, setSortLabel] = useState("sort by"); 
  const [userZipCode, setUserZipcode] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [distancesCalculated, setDistancesCalculated] = useState(false);
  const [isPostsLoaded, setIsPostsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log("Response data location:", response.data[0]); 
    
        const posts = response.data; 
        const parsedPosts = posts.map(post => {
          // Determine the username based on the condition
          const username = post.username.trim() === '' ? post.poster_uuid : post.username;
  
          return {
            post_id: post.id,
            username: username,
            date: new Date(post.date).toLocaleDateString(),
            content: 
              `Services Seeking: ${post.skillsAsked || 'N/A'}\n` +
              `Services Offering: ${post.skillsOffered || 'N/A'}\n` +
              `${post.description || ''}`, 
            categories: post.categories || [],
            zipcode: post.location || undefined
          };
        });   
        
        setPosts(parsedPosts); 
        samplePosts.length = 0; //clearing the array
        samplePosts.push(...parsedPosts); 
        setIsPostsLoaded(true);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsPostsLoaded(true);
      }
    };

    fetchPosts();
  }, [selectedCategories]);
  // this effect doesnt finish before this next useeffect 105 requires previous to finish

  useEffect(() => {
    
    if (!isPostsLoaded) return; // Wait until posts are loaded

    const updateFilteredPosts = async () => {
      let postsWithDistances = posts; 
      // loginContext.zip for getting the user's zipcode

      // Calculate distances only on the first load
    if (!distancesCalculated && userZipCode) {
      postsWithDistances = await calculateDistances(posts, loginContext.zip);
      setPosts(postsWithDistances); // Update posts with distances
      setDistancesCalculated(true); // Mark distances as calculated
      console.log("Posts with distances calculated:", postsWithDistances);
    }

      const filtered = postsWithDistances.filter((post) => {
        const searchWords = keyword.toLowerCase().split(' ').filter(Boolean);
      
          // Exclude "Services Seeking" and "Services Offering" prefixes from the search
          const searchableContent = post.content
            .split('\n')
            .map((line) => {
              if (
                line.toLowerCase().startsWith("services seeking:") ||
                line.toLowerCase().startsWith("services offering:")
              ) {
                return line.substring(line.indexOf(':') + 1).trim(); // Remove prefix
              }
              return line;
            })
            .join(' ')
            .toLowerCase();
        
          // Check if all words from the search are in the searchable content
          const includesAllKeywords = searchWords.every((word) =>
            searchableContent.includes(word)
          );
        
          if (selectedCategories.length === 0) {
            return includesAllKeywords;
          } else {
            const includesCategory = post.categories.some((category) =>
              selectedCategories.includes(category)
            );
            return includesCategory && includesAllKeywords;
          }
        })
        .sort((a, b) => {
          switch (sortOrder) {
            case 'newest':
              return new Date(b.date) - new Date(a.date);
            case 'oldest':
              return new Date(a.date) - new Date(b.date);
            case 'nearest':
              if (a.zipcode === undefined && b.zipcode !== undefined) return 1;
              if (b.zipcode === undefined && a.zipcode !== undefined) return -1;
              return a.distance - b.distance;
            default:
              return 0;
          }
        });
    
      setFilteredPosts(filtered); 
      setIsLoading(false);
    };

    updateFilteredPosts();
  }, [posts, keyword, selectedCategories, sortOrder, userZipCode, distancesCalculated, isPostsLoaded]);

  // Function to calculate distances for all posts
  async function calculateDistances(posts, userZipCode) {
    if (!userZipCode) return posts;
    
    const postsWithDistances = await Promise.all(posts.map(async (post) => {
      const distance = post.zipcode !== undefined ? await getDistanceByZip(userZipCode, post.zipcode) : Infinity;
      return { ...post, distance }; 
    }));
    return postsWithDistances;
  }

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
                username={loginContext.userFirstName}
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
                  {loginContext.zip && (
                  <button className={styles.sortOption} onClick={() => handleSortOption('nearest')}>Nearest</button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.postsContainer}>
            {isLoading ? (
              <p className={styles.loadingMessage}>Loading posts, please wait...</p>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
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
              keyword && <p>No posts match your search criteria.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ServiceSearch;