import React from 'react';
import styles from './signup.module.css'; 
import SignUpPage from './signup';

const signupPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.SignUpPage}>
        <SignUpPage />
      </main>
    </div>
  );
};

export default signupPage;