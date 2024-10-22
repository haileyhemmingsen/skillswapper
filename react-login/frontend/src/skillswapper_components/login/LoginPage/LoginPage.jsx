import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {db, auth} from '../../../firebase.ts';
// import {db, auth} from '~/../../auth-server/firebase.ts';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import axios from 'axios'

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountError, setAccountError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setAccountError('');

    let hasError = false;

    if (email === '') {
      setEmailError('Email field must not be empty');
      hasError = true;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (password === '') {
      setPasswordError('Password field must not be empty');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      hasError = true;
    }

    if (hasError) return;

    const dto = {
      email: email, 
      password: password
    };

    const response = await axios.post('http://localhost:3080/api/v0/login', dto, {header: {
      'Content-Type': 'application/json'
    }}).then((res) => {
      console.log(res);
      console.log('here');
      props.setLoggedIn(true);
      props.setEmail(email);
      navigate('/homepage');
    }).catch((err) => {
      console.log(err);
    })


  };



  return (
    <main className={styles.loginPage}>
      <section className={styles.container}>
        <img src={logo} alt="SkillSwapper Title" className={styles.logo} />
        <img src={title} alt="Login Title" className={styles.title} />
        <form>
          <div>
            <label htmlFor="email" className={styles['visually-hidden']}>Email</label>
            <input
              id="email"
              className={styles.inputField}
              type="text"
              placeholder="Email..."
              aria-label="Email"
              onChange={(ev) => setEmail(ev.target.value)}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}
            {accountError && <p className={styles.errorText}>{accountError}</p>}
          </div>
          <div>
            <label htmlFor="password" className={styles['visually-hidden']}>Password</label>
            <input
              id="password"
              className={styles.inputField}
              type="password"
              placeholder="Password..."
              aria-label="Password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
            {passwordError && <p className={styles.errorText}>{passwordError}</p>}
          </div>
          <button type="submit" className={styles.loginButton} onClick={onButtonClick}>Log In</button>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account? <a href="http://localhost:3000/figma-login"> Sign up </a>
        </p>
      </section>
    </main>
  );
};

export default Login;