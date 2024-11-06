import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';
import eyeClosed from '../../../images/eyeClosed.svg'; 
import eyeOpen from '../../../images/eyeOpen.svg';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { LoginContext } from '../../../context/Login.tsx';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginContext = React.useContext(LoginContext);

  const navigate = useNavigate();

  const onButtonClick = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

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

    const response = await axios.post('http://localhost:3080/api/v0/login', 
        dto, 
        {header: {'Content-Type': 'application/json'},
        withCredentials: true
      }
    ).then((res) => {
        console.log(res);
        const accessToken = res.data.accessToken;
        const id = res.data.id;

        props.setLoggedIn(true);
        props.setEmail(email);
        console.log('name: ' + res.data.name);
        loginContext.setAccessToken(accessToken);
        loginContext.setUserName(res.data.name);
        loginContext.setId(id);
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
            {emailError && <p className={styles.errorLabel}>{emailError}</p>}
          </div>
          <div className={styles.passwordContainer}>
            <label htmlFor="password" className={styles['visually-hidden']}>Password</label>
            <input
              id="password"
              className={styles.inputField}
              type={showPassword ? 'text' : 'password'}  // Toggle between text and password
              placeholder="Password..."
              aria-label="Password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle password visibility"
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}  // Handle toggle on click
            />
            {passwordError && <p className={styles.errorLabel}>{passwordError}</p>}
          </div>
          <button type="button" className={styles.loginButton} onClick={onButtonClick}>Log In</button>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </section>
    </main>
  );
};

export default Login;