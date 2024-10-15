import React from 'react';
import styles from './homepage.module.css'; 
import CategorySelection from './CategorySelection/CategorySelection';
import ServiceSearch from './MainFeed/ServiceSearch';

const homepage = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.categorySection}>
        <CategorySelection />
      </aside>
      <main className={styles.mainFeed}>
        <ServiceSearch />
      </main>
    </div>
  );
};

export default homepage;
