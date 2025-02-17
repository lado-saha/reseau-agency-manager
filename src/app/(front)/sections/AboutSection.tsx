// app/sections/AboutUsSection.tsx

import styles from '../../front-styles/AboutUsSection.module.css';

const AboutUsSection = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Us</h2>
        <p className={styles.description}>
          We are a dedicated team committed to helping you find the best travel experiences. Our mission is to create memorable journeys and seamless travel planning tailored to your needs.
        </p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Our Mission</h3>
            <p>To make travel easy, accessible, and enjoyable for everyone by providing exceptional services and support.</p>
          </div>
          <div className={styles.card}>
            <h3>Our Values</h3>
            <p>We prioritize customer satisfaction, quality, and transparency in every interaction.</p>
          </div>
          <div className={styles.card}>
            <h3>Why Choose Us</h3>
            <p>We offer personalized services and exclusive deals that you won’t find anywhere else.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
