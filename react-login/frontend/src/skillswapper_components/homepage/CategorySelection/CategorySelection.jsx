import React, { useState } from 'react';
import styles from './CategorySelection.module.css';
import CategoryImage from './CategoryImage';
import basketballImage from '../../../images/basketball.svg';
import mediaImage from '../../../images/media.svg';
import musicImage from '../../../images/music.svg';
import foodImage from '../../../images/food.svg';
import digitalImage from '../../../images/digital.svg';
import fixingImage from '../../../images/fixing.svg';
import logo from '../../../images/SkillSwapper.svg';


const categories = [
  { src: basketballImage, alt: "Basketball" },
  { src: mediaImage, alt: "Media" },
  { src: musicImage, alt: "Music" },
  { src: foodImage, alt: "food" },
  { src: digitalImage, alt: "digital" },
  { src: fixingImage, alt: "fixing" }
];

const CategorySelection = () => {

  // State to track which buttons are active (using an array of boolean values)
  const [activeCategories, setActiveCategories] = useState(Array(categories.length).fill(false));

  const handleCategoryClick = (index) => {
    const newActiveCategories = [...activeCategories];
    newActiveCategories[index] = !newActiveCategories[index];
    setActiveCategories(newActiveCategories);
  };

  return (
    <main className={styles.container}>
      <img src={logo} alt="SkillSwapper Logo" className={styles.logo} />
      <h2 className={styles.categoryPrompt}>Select category...</h2>
      <section className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <button
          key={index}
          className={`${styles.categoryButton} ${activeCategories[index] ? styles.active : ''}`}
          onClick={() => handleCategoryClick(index)}>       
            <CategoryImage key={index} src={category.src} alt={category.alt} />
          </button>
        ))}
      </section>
    </main>
  );
};

export default CategorySelection;