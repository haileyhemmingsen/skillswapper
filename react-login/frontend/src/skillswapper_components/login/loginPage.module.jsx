import React from 'react';
import styles from './LoginPage.module.css';
import LoginPage from './LoginPage/LoginPage';
// import ServiceSearch from './MainFeed/ServiceSearch';

const loginPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.LoginPage}>
        <LoginPage />
      </main>
    </div>
  );
};

export default loginPage;
