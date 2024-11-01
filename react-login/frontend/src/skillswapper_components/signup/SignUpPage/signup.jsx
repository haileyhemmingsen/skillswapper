import React, { useState } from 'react';
import styles from '../signUp.module.css';
import signupLogo from '../../../images/SignupLoginSkillSwapper.svg';
import signupText from '../../../images/signup.svg';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUpPage = (props) => {
  
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [zip, setZip] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [zipError, setZipError] = useState('');

    const validateEmail = async (email) => {
      if (email === '') {
          setEmailError('Email field must not be empty');
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          setEmailError('Please enter a valid email');
      } else {
          setEmailError('');
      }
    };

    const validatePassword = (password) => {
        if (password === '') {
            setPasswordError('Password field must not be empty');
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }
    };

    const validateZip = (zip_code) => {
        const regex = /^\d{5}(-\d{4})?$/;
        if (zip_code !== '' && !regex.test(zip_code)) {
            setZipError('Zip Code can only contain numbers');
        } else {
            setZipError('');
        }
    };

    const onButtonClick = async (e) => {
      e.preventDefault();
      setEmailError('');
      setPasswordError('');
      setZipError('');

      let hasError = false;

      validateEmail(email);
      validatePassword(password);
      validateZip(zip);

      // Check if any error exists
      if (emailError || passwordError || zipError) {
          hasError = true;
      }

      if (hasError) return;

      let [firstName, lastName] = name.split(' ');
      if (!lastName) {
        lastName = '';
      }
      const dto = { email: email, password: password, firstname: firstName, lastname: lastName, zip: zip };
      console.log(dto);

      const response = await axios.post('http://localhost:3080/api/v0/signup',
          dto,
          { header: { 'Content-Type': 'application/json' } }
      ).then((res) => {
          console.log(res);
          if (res.data) {
            props.setLoggedIn(true);
            props.setEmail(email);
            navigate('/login');
          }
          else {
            // there is an error of some kind, internal service error, show something to the user that 
            // signup failed, is possible account already exists, or some other error

          }
          
      }).catch((err) => {
          console.log(err);
      });
  };

  return (
    <main className={styles.signupPage}>
      <section className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={signupLogo} alt="SkillSwapper Signup and Login Logo" className={styles.signupLogo} />
          <img src={signupText} alt="Sign Up" className={styles.signupText} />
        </div>
        <form>
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <input
                key='email'
                id='email'
                type='text'
                placeholder='Enter Email...'
                className={styles.inputField}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                  validateEmail(ev.target.value)
                }}              
              />
              {emailError && <p className={styles.errorLabel}>{emailError}</p>}
            </div>
            <div className={styles.inputContainer}>
              <input
                key='password'
                id='password'
                type='password'
                placeholder='Create Password...'
                className={styles.inputField}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                  validatePassword(ev.target.value);
                }}
              />
              {passwordError && <p className={styles.errorLabel}>{passwordError}</p>}
            </div>
            <div className={styles.inputContainer}>
              <input
                key='fullName'
                id='fullName'
                type='text'
                placeholder='Enter First & Last Name...'
                className={styles.inputField}
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                key='zipCode'
                id='zipCode'
                type='text'
                placeholder='Enter Zip Code...'
                className={styles.inputField}
                onChange={(ev) => {
                  setZip(ev.target.value);
                  validateZip(ev.target.value);
                }}              />
              {zipError && <p className={styles.errorLabel}>{zipError}</p>}
            </div>
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="button" className={styles.submitButton} onClick={onButtonClick}>
              Sign Up
            </button>
          </div>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </section>
    </main>
  );
};

export default SignUpPage;