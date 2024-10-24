import React, { useState } from 'react';
import styles from '../signUp.module.css';
import signupLogo from '../../../images/SignupLoginSkillSwapper.svg';
import signupText from '../../../images/signup.svg';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUpPage = (props) => {
  
    const navigate = useNavigate();
    // create all values used to maintain page state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [zip, setZip] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [zipError, setZipError] = useState('');

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

        function validZip(zip_code) {
            const regex = /^\d{5}(-\d{4})?$/;
            return regex.test(zip_code);
        }

        if (zip !== '' && !validZip(zip)) {
            setZipError('Zip Code can only contain numbers');
            hasError = true;
        }
        
        //zip and name can be allowed empty
    
        if (hasError) return;

        const [firstName, lastName] = name.split(' ');
        const dto = {email: email, password: password, firstName: firstName, lastName: lastName, zip: zip};
        console.log(dto);
      
          const response = await axios.post('http://localhost:3080/api/v0/signup', 
              dto, 
              {header: {'Content-Type': 'application/json'}}
          ).then((res) => {
              console.log(res);
              //currently the result of the signup attempt returns just a boolean for whether we succeeded in creating the account, this functionality needs to be expanded. 
            //   const accessToken = res.data.accessToken;
            //   const id = res.data.id;
      
              props.setLoggedIn(true);
              props.setEmail(email);
              navigate('/homepage');
          }).catch((err) => {
            console.log(err);
          })
    };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const { fullName } = formData;
//     const [firstName, lastName] = fullName.split(' ');
//     // console.log('First Name:', firstName);
//     // console.log('Last Name:', lastName); 
//     // console.log(formData);
//     const dto = {email: formData.email, password: formData.password, firstName: firstName, lastName: lastName, zip: formData.zipCode};
//     console.log(dto);
//     // axios call here
//   };
    

  return (
    <main className={styles.signupPage}>
      <section className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={signupLogo} alt="SkillSwapper Signup and Login Logo" className={styles.signupLogo} />
          <img src={signupText} alt="Sign Up" className={styles.signupText} />
        </div>
        <form>
        <div className={styles.formGroup}>
              <input
                key='email'
                id='email'
                type='text'
                placeholder='Enter Email...'
                className={styles.inputField}
                // value={formData['email']}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              {emailError && <p className={styles.errorLabel}>{emailError}</p>}
              <input
                key='password'
                id='password'
                type='password'
                placeholder='Create Password...'
                className={styles.inputField}
                // value={formData['password']}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              {passwordError && <p className={styles.errorLabel}>{passwordError}</p>}
              <input
                key='fullName'
                id='fullName'
                type='text'
                placeholder='Enter First & Last Name...'
                className={styles.inputField}
                // value={formData['fullName']}
                onChange={(ev) => setName(ev.target.value)}
              />
              <input
                key='zipCode'
                id='zipCode'
                type='text'
                placeholder='Enter Zip Code...'
                className={styles.inputField}
                // value={formData['zipCode']}
                onChange={(ev) => setZip(ev.target.value)}
              />
              {zipError && <p className={styles.errorLabel}>{zipError}</p>}
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="button" className={styles.submitButton} onClick={onButtonClick}>
            Sign Up
            </button>
            {/* <button type="submit" className={styles.submitButton}>
              Sign Up
            </button> */}
          </div>
        </form>
        {/* <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
              <input
                key='email'
                id='email'
                type='text'
                placeholder='Enter Email...'
                className={styles.inputField}
                value={formData['email']}
                onChange={handleChange}
              />
              {error}
              <input
                key='password'
                id='password'
                type='password'
                placeholder='Create Password...'
                className={styles.inputField}
                value={formData['password']}
                onChange={handleChange}
              />
              {error}
              <input
                key='fullName'
                id='fullName'
                type='text'
                placeholder='Enter First & Last Name...'
                className={styles.inputField}
                value={formData['fullName']}
                onChange={handleChange}
              />
              {error}
              <input
                key='zipCode'
                id='zipCode'
                type='text'
                placeholder='Enter Zip Code...'
                className={styles.inputField}
                value={formData['zipCode']}
                onChange={handleChange}
              />
              {error}
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </div>
        </form> */}
        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </section>
    </main>
  );
};

export default SignUpPage;