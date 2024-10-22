import styles from '../loginPage.module.css';
import logo from '../../../images/SkillSwapper.svg';
import title from '../../../images/Log_In.svg';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
  
    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }
  
    // Authentication calls will be made here...

    checkAccountExists((accountExists) => {
        // If yes, log in
        if (accountExists) logIn()
        // Else, ask user if they want to create a new account and if yes, then log in
        else if (
          window.confirm(
            'An account does not exist with this email address: ' +
              email +
              '. Do you want to create a new account?',
          )
        ) {
          logIn()
        }
      })
  }

  const checkAccountExists = (callback) => {
    fetch('http://localhost:3080/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }
  
  // Log in a user using email and password
  const logIn = () => {
    fetch('http://localhost:3080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if ('success' === r.message) {
          localStorage.setItem('user', JSON.stringify({ email, token: r.token }))
          props.setLoggedIn(true)
          props.setEmail(email)
          navigate('/')
        } else {
          window.alert('Wrong email or password')
        }
      })
  }


  return (
    <main className={styles.loginPage}>
      <section className={styles.container}>
        {/* <h1 className={styles.logo}>SkillSwapper</h1>
        <h2 className={styles.title}>Log In</h2> */}
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
            <label className="errorLabel">{emailError}</label>
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
            <label className="errorLabel">{passwordError}</label>
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