import React from 'react';
import styles from './ImageGallery.module.css';

const GalleryImage = ({ src, alt, className }) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className={`${styles.galleryImage} ${className}`}
  />
);

export default GalleryImage;
