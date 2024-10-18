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
  { src: basketballImage, alt: "Sports" },
  { src: mediaImage, alt: "Media" },
  { src: musicImage, alt: "Music" },
  { src: foodImage, alt: "Food" },
  { src: digitalImage, alt: "Digital" },
  { src: fixingImage, alt: "Handywork" }
];

const CategorySelection = () => {
  // State to track which buttons are active
  const [activeCategories, setActiveCategories] = useState(Array(categories.length).fill(false));
  // State to track the selected categories' alt texts
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (index, alt) => {
    const newActiveCategories = [...activeCategories];
    newActiveCategories[index] = !newActiveCategories[index];
    setActiveCategories(newActiveCategories);

    if (newActiveCategories[index]) {
      // If category is selected, add its alt text to selectedCategories
      setSelectedCategories([...selectedCategories, alt]);
    } else {
      // If category is deselected, remove its alt text from selectedCategories
      setSelectedCategories(selectedCategories.filter(category => category !== alt));
    }
  };

  return (
    <main className={styles.container}>
      <img src={logo} alt="SkillSwapper Logo" className={styles.logo} />
      <h2 className={styles.categoryPrompt}>
        {selectedCategories.length > 0 ? `Selected: ${selectedCategories.join(', ')}` : "Select category..."}
      </h2>
      <section className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`${styles.categoryButton} ${activeCategories[index] ? styles.active : ''}`}
            onClick={() => handleCategoryClick(index, category.alt)}>
            <CategoryImage key={index} src={category.src} alt={category.alt} />
          </button>
        ))}
      </section>
    </main>
  );
};

export default CategorySelection;