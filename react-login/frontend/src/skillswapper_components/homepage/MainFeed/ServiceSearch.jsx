import React from "react";
import styles from './ServiceSearch.module.css';
import ServicePost from './ServicePost';

const samplePosts = [
  { id: 1, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 2, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 3, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
  { id: 4, username: "Username", date: "mm/dd/yyyy", content: "Seeking for...\nOffer..." },
];

function ServiceSearch() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8a42e08accb6454925660806259cb2c98d4a1bbc9c2c49bcc91d81cf9c93bdce?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d" className={styles.logoCompany} alt="Company logo" />
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/04d842ce26a9dbff21915e79181c634b479f69d35289500c69b03a67cbd4295d?placeholderIfAbsent=true&apiKey=d4809dff43a0497eb3b4b1f0b8ac743d" className={styles.logoUser} alt="User logo" />
      </header>
      <div className={styles.mainContent}>
        <section className={styles.searchSection}>
          <h1 className={styles.searchTitle}>What service are you looking for?</h1>
          <form>
            <label htmlFor="serviceSearch" className={styles['visually-hidden']}>Search for services</label>
            <input
              type="text"
              id="serviceSearch"
              className={styles.searchInput}
              placeholder="Type keywords here..."
              aria-label="Search for services"
            />
          </form>
          <button type="submit" className={styles.postButton}>Make a post</button>
          {samplePosts.map((post) => (
            <ServicePost key={post.id} {...post} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default ServiceSearch;