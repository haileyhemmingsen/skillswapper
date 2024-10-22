import React, { useState } from 'react';
import styles from './signup.module.css';
import signupLogo from '../../images/SignupLoginSkillSwapper.svg';
import signupText from '../../images/signup.svg';

const SignUpPage = () => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    zipCode: '',
  });

  const inputFields = [
    { id: 'email', placeholder: 'Enter Email...', type: 'text' },
    { id: 'password', placeholder: 'Create Password...', type: 'password' },
    { id: 'fullName', placeholder: 'Enter First & Last Name...', type: 'text' },
    { id: 'zipCode', placeholder: 'Enter Zip Code...', type: 'text' },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName } = formData;
    const [firstName, lastName] = fullName.split(' ');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName); 
  };
    

  return (
    <main className={styles.signupPage}>
      <section className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={signupLogo} alt="SkillSwapper Signup and Login Logo" className={styles.signupLogo} />
          <img src={signupText} alt="Sign Up" className={styles.signupText} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            {inputFields.map((field) => (
              <input
                key={field.id}
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className={styles.inputField}
                value={formData[field.id]}
                onChange={handleChange}
              />
            ))}
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="submit" className={styles.submitButton}>
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