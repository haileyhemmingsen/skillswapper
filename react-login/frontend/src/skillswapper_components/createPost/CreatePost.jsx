import React, { useState } from "react";
import styles from './CreatePost.module.css';
import menuIcon from '../../images/3dots.svg';
import ImageGallery from '../../skillswapper_components/createPost/tagMenu/ImageGallery';


// import Kantumruy pro font
<style>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');
</style>



function CreatePost() {

  const [tagMenuVisible, setTagMenuVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleIconClick = () => {
    setTagMenuVisible(!tagMenuVisible);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };


  return (
    <main className={styles.createPost}>
      <div className={styles.postContainer}>
      <div className={styles.topIcons}>
        <img  
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cfdc61dafac0285a079f24b0b6281e077a22c077a2b773601af0abc34588e6ab?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d" 
            className={styles.decorativeIcon} 
            alt=""
          />
      </div>

        <div className={styles.whiteContainer}>
          <div className={styles.userInfo}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0892ef7e5481f4d70f5efe3be9f0db1227ca1971dc54c137c4973438e6803815?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d"
              className={styles.userAvatar}
              alt="User avatar"
            />
            <div className={styles.username}>Username</div>

            <div className={styles.topIcons}>
              <img src={menuIcon} alt="Menu" className={styles.dotsIcon} />

            </div>

          </div>

          <form className={styles.formContainer}>
            <label htmlFor="seekingService" className={styles.formLabel}>
              What service you are <em>seeking</em>?
            </label>
            <input
              id="seekingService"
              className={styles.formInput}
              type="text"
              placeholder="I am seeking..."
            />

            <label htmlFor="offeringService" className={styles.formLabel}>
              What service you can <em>offer</em>?
            </label>
            <input
              id="offeringService"
              className={styles.formInput}
              type="text"
              placeholder="I can offer..."
            />

            <label htmlFor="categories" className={styles.formLabel}>
              Specify categories for <em>offered</em> services
            </label>
            <div className={styles.categorySelector}>
              <div className={styles.selectedCategories}>
                {selectedCategories.length > 0
                  ? selectedCategories.map((category, index) => (
                      <img
                        key={index}
                        src={category.src}
                        alt={category.alt}
                        className={styles.selectedCategory}
                      />
                    ))
                  : 'Select categories...'}
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c02708517ae2b44f99b87ca2e0ac883ae58942efb0d1107fbb89944fd25a51ea?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d"
                className={styles.dropdownIcon}
                alt=""
                onClick={handleIconClick}
              />
            </div>

            {tagMenuVisible && (
              <div className={styles.tagMenu}>
                <ImageGallery onCategorySelect={handleCategorySelect}  selectedCategories={selectedCategories} /> {/* Render the ImageGallery component */}
              </div>
            )}

            <label htmlFor="additionalInfo" className={styles.formLabel}>
              Additional information
            </label>
            <input
              id="additionalInfo"
              className={styles.formInput}
              type="text"
              placeholder="Enter more info..."
            ></input>
            
          </form>
          <button type="submit" className={styles.postButton}>
              Post
            </button>
        </div>
        
      </div>
    </main>
  );
}

export default CreatePost;