import React from 'react';
import styles from './CategorySelection.module.css';
import CategoryImage from './CategoryImage';

const categories = [
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/47c11338-b0b2-42a2-858a-d7c9e0a1164b?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 1" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/ffb8adb7-99ac-42b6-bbd1-e33e75de7449?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 2" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/70e63a91-fad9-4059-86c0-87e7de6d58c4?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 3" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/0135e07e-e589-470b-88f0-f8c8ed6b8bdb?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 4" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/dcd86c9f-1de5-44d3-921f-b99fde750855?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 5" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/218e339f-ff9f-4664-8186-54914684acb4?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d", alt: "Category 6" }
];

const CategorySelection = () => {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>SkillSwapper</h1>
      <h2 className={styles.categoryPrompt}>Select category...</h2>
      <section className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <CategoryImage key={index} src={category.src} alt={category.alt} />
        ))}
      </section>
    </main>
  );
};

export default CategorySelection;