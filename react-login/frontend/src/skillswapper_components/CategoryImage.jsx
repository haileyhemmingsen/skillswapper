import React from 'react';
import styles from './CategorySelection.module.css';

const CategoryImage = ({ src, alt }) => (
  <img loading="lazy" src={src} alt={alt} className={styles.categoryImage} />
);

export default CategoryImage;