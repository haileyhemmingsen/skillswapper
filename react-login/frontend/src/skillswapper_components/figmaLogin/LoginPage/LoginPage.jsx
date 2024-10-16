import React from 'react';
import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';


const LoginPage = () => {
  return (
    <main className={styles.loginPage}>
      <section className={styles.container}>
        {/* <h1 className={styles.logo}>SkillSwapper</h1>
        <h2 className={styles.title}>Log In</h2> */}
        <img src={logo} alt="SkillSwapper Title" className={styles.logo} />
        <img src={title} alt="Login Title" className={styles.title} />
        <form>
          <div>
            <label htmlFor="username" className={styles['visually-hidden']}>Username</label>
            <input
              id="username"
              className={styles.inputField}
              type="text"
              placeholder="Username..."
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className={styles['visually-hidden']}>Password</label>
            <input
              id="password"
              className={styles.inputField}
              type="password"
              placeholder="Password..."
              aria-label="Password"
            />
          </div>
          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account? <a href="http://localhost:3000/figma-login"> Sign up </a>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;