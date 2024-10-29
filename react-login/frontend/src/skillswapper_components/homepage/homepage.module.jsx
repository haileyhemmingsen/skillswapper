import React, { useState } from 'react';
import styles from './homepage.module.css'; 
import CategorySelection from './CategorySelection/CategorySelection';
import ServiceSearch from './MainFeed/ServiceSearch';

const Homepage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  return (
    <div className={styles.container}>
      <aside className={styles.categorySection}>
        <CategorySelection setSelectedCategories={setSelectedCategories} />
      </aside>
      <main className={styles.mainFeed}>
        <ServiceSearch selectedCategories={selectedCategories} />
      </main>
    </div>
  );
};

export default Homepage;