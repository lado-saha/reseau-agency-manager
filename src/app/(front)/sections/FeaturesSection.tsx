// app/sections/FeaturesSection.tsx
import styles from '../../front-styles/FeaturesSection.module.css';
import { FaRegCompass, FaTags, FaHeadset } from 'react-icons/fa'; // Pour les icônes

const FeaturesSection = () => {
    return (
      <section id="features" className={styles.featuresSection}>
        <h2 className={styles.title}>Our Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <FaRegCompass className={styles.icon} />
            <h3 className={styles.featureTitle}>Personalized Travel Planning</h3>
            <p className={styles.featureDescription}>Get a customized itinerary tailored just for you, ensuring a seamless and memorable experience.</p>

          </div>
          <div className={styles.featureCard}>
            <FaTags className={styles.icon} />
            <h3>Exclusive Discounts & Deals</h3>
            <p>Enjoy exclusive offers and discounts that make your travel affordable and delightful.</p>
          </div>
          <div className={styles.featureCard}>
            <FaHeadset className={styles.icon} />
            <h3>24/7 Customer Support</h3>
            <p>We are here to assist you at any time, ensuring a smooth and hassle-free journey.</p>
          </div>
        </div>
      </section>
    );
  };
  
export default FeaturesSection;
