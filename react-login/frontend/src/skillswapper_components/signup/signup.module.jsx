import React from 'react';
import styles from './signUp.module.css'; 
import SignUpPage from './SignUpPage/signup';

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