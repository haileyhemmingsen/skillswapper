import React from 'react';
import styles from './CategorySelection.module.css';
import CategoryImage from './CategoryImage';
import basketballImage from '../../../images/basketball.jpg';
import mediaImage from '../../../images/media.jpg';
import musicImage from '../../../images/music.jpg';
import foodImage from '../../../images/food.jpg';
import digitalImage from '../../../images/digital.jpg';
import fixingImage from '../../../images/fixing.jpg';
import logo from '../../../images/longLogo.png';


const categories = [
  { src: basketballImage, alt: "Basketball" },
  { src: mediaImage, alt: "Media" },
  { src: musicImage, alt: "Music" },
  { src: foodImage, alt: "food" },
  { src: digitalImage, alt: "digital" },
  { src: fixingImage, alt: "fixing" }
];

const CategorySelection = () => {
  return (
    <main className={styles.container}>
      <img src={logo} alt="SkillSwapper Logo" className={styles.logo} />
      <h2 className={styles.categoryPrompt}>Select category...</h2>
      <section className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <button key={index} className={styles.categoryButton}>
            <CategoryImage key={index} src={category.src} alt={category.alt} />
          </button>
        ))}
      </section>
    </main>
  );
};

export default CategorySelection;