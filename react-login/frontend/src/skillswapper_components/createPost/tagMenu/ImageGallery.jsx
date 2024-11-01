import React from 'react';
import styles from './ImageGallery.module.css';
/* import GalleryImage from './GalleryImage'; */
import basketballImage from '../../../images/basketball.svg';
import mediaImage from '../../../images/media.svg';
import musicImage from '../../../images/music.svg';
import foodImage from '../../../images/food.svg';
import digitalImage from '../../../images/digital.svg';
import fixingImage from '../../../images/fixing.svg';

const galleryImages = [
  { src: basketballImage, alt: 'Sports', className: `${styles.imageSize1} ${styles.galleryImage}` },
  { src: mediaImage, alt: 'Media', className: `${styles.imageSize1} ${styles.galleryImage}` },
  { src: musicImage, alt: 'Music', className: `${styles.imageSize1} ${styles.galleryImage}` },
  { src: foodImage, alt: 'Food', className: `${styles.imageSize2} ${styles.galleryImage}` },
  { src: digitalImage, alt: 'Digital', className: `${styles.imageSize1} ${styles.galleryImage}` },
  { src: fixingImage, alt: 'Handywork', className: `${styles.imageSize1} ${styles.galleryImage}` }
];

const ImageGallery = ({ onCategorySelect }) => (
  <section className={styles.tagMenu}>
    <div className={styles.imageRow}>
      {galleryImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={image.className}
          onClick={() => onCategorySelect(image)}
        />
      ))}
    </div>
  </section>
);

export default ImageGallery;