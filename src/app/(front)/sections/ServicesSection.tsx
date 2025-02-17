// app/sections/OurServicesSection.tsx

import styles from '../../front-styles/OurServicesSection.module.css';

const OurServicesSection = () => {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Services</h2>
        <div className={styles.servicesList}>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🗺️</div>
            <h3>Travel Planning</h3>
            <p>Tailored travel plans to ensure seamless and memorable journeys.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>💸</div>
            <h3>Exclusive Deals</h3>
            <p>Access to exclusive travel deals and discounts to save on adventures.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📞</div>
            <h3>24/7 Support</h3>
            <p>Our team is available around the clock to assist with any queries.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📅</div>
            <h3>Booking Management</h3>
            <p>Centralized booking management for hotels, flights, and activities.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🌐</div>
            <h3>Virtual Tour Previews</h3>
            <p>Explore destinations virtually before making travel decisions.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🧳</div>
            <h3>Itinerary Creation</h3>
            <p>Custom itineraries tailored to customer preferences and needs.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🛡️</div>
            <h3>Travel Insurance</h3>
            <p>Comprehensive travel insurance options to ensure peace of mind.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>👥</div>
            <h3>Group Travel Planning</h3>
            <p>Organize group travel with customizable options for every group.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📱</div>
            <h3>Real-time Updates</h3>
            <p>Stay informed with real-time updates on flights and weather.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🎁</div>
            <h3>Loyalty Programs</h3>
            <p>Earn rewards and enjoy loyalty benefits for frequent travelers.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>📖</div>
            <h3>Local Guide Recommendations</h3>
            <p>Get expert recommendations for an authentic travel experience.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>💱</div>
            <h3>Multi-Currency Support</h3>
            <p>Flexible currency options for easy, global payments.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🛂</div>
            <h3>Visa Assistance</h3>
            <p>Get assistance with visa requirements and documentation.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🌍</div>
            <h3>Eco-Friendly Options</h3>
            <p>Environmentally conscious travel options for a sustainable future.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🤖</div>
            <h3>AI Trip Suggestions</h3>
            <p>Get travel suggestions based on your unique preferences.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🚨</div>
            <h3>Emergency Assistance</h3>
            <p>24/7 emergency support for any critical travel situations.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>💬</div>
            <h3>Language Support</h3>
            <p>Translation and language support to bridge communication gaps.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;
