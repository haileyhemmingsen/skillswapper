/*import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountError, setAccountError] = useState('');

  const navigate = useNavigate()

  const onButtonClick = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    // Reset error messages
    setEmailError('');
    setPasswordError('');
    setAccountError('');

    // Input validation
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

    if (hasError) return; // Stop the login attempt if there are validation errors


    // Authentication calls will be made here...
    // Check if account exists
    checkAccountExists((accountExists) => {
      if (accountExists) {
        // Attempt login
        logIn();
      } else {
        setAccountError('This email is not registered.');
      }
    });
  };

  const checkAccountExists = (callback) => {
    fetch('http://localhost:3080/api/v0/docs/#/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists);
      })
      .catch(() => {
        setAccountError('An error occurred while checking your account.');
      });
  };

  // Log in a user using email and password
  const logIn = () => {
    fetch('http://localhost:3080/api/v0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.message === 'success') {
          localStorage.setItem('user', JSON.stringify({ email, token: r.token }));
          props.setLoggedIn(true);
          props.setEmail(email);
          navigate('/homepage');
        } else {
          setPasswordError('Incorrect password. Please try again.');
        }
      })
      .catch(() => {
        setAccountError('Login failed. Please try again later.');
      });
  };


  return (
    <main className={styles.loginPage}>
      <section className={styles.container}>
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
export default Login;*/

import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {db, auth} from '../../../firebase.ts';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountError, setAccountError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = (e) => {
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

    checkAccountExists((accountExists) => {
      if (accountExists) {
        logIn();
      } else {
        setAccountError('This email is not registered.');
      }
    });
  };

  const checkAccountExists = async (callback) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      callback(!snapshot.empty);
    } catch (error) {
      console.error('Error checking account:', error);
      setAccountError('An error occurred while checking your account.');
    }
  };

  // const logIn = () => {
  //   fetch('http://localhost:3080/api/v0/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email, password }),
  //   })
  //     .then((r) => r.json())
  //     .then((r) => {
  //       if (r.message === 'success') {
  //         localStorage.setItem('user', JSON.stringify({ email, token: r.token }));
  //         props.setLoggedIn(true);
  //         props.setEmail(email);
  //         navigate('/homepage');
  //       } else {
  //         setPasswordError('Incorrect password. Please try again.');
  //       }
  //     })
  //     .catch(() => {
  //       setAccountError('Login failed. Please try again later.');
  //     });
  // };


  const logIn = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        // Password validation logic here
        // localStorage.setItem('user', JSON.stringify({ email, token: q.token }));
        props.setLoggedIn(true);
        props.setEmail(email);
        navigate('/homepage');
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setAccountError('Login failed. Please try again later.');
    }
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.container}>
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