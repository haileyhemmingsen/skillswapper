import React from 'react';
import styles from './signup.module.css';
import signupLogo from '../../images/SignupLoginSkillSwapper.svg';
import signupText from '../../images/signup.svg';

const SignUpPage = () => {
  const inputFields = [
    { id: 'email', placeholder: 'Enter Email...', type: 'text' },
    { id: 'password', placeholder: 'Create Password...', type: 'password' },
    { id: 'fullName', placeholder: 'Enter Full name...', type: 'text' },
    { id: 'zipCode', placeholder: 'Enter Zip Code...', type: 'text' },
  ];

  return (
    <main className={styles.signupPage}>
      <section className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={signupLogo} alt="SkillSwapper Signup and Login Logo" className={styles.signupLogo} />
          <img src={signupText} alt="Sign Up" className={styles.signupText} />
        </div>
        <form>
          <div className={styles.formGroup}>
            {inputFields.map((field) => (
              <input
                key={field.id}
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className={styles.inputField}
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