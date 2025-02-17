// app/sections/FooterSection.tsx

import styles from '../../front-styles/FooterSection.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGem } from 'react-icons/fa';
import { AiFillAndroid, AiFillApple } from 'react-icons/ai';

export default function FooterSection() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo et Description */}
        <div className={styles.footerLogo}>
          <h3>Travelo</h3>
          <p>Explore the world with ease and convenience. Your next adventure awaits!</p>
        </div>

        {/* Téléchargements et Chatbot */}
        <div className={styles.footerApps}>
          <h4>Get the App</h4>
          <div className={styles.downloadLinks}>
            <a href="#" className={styles.downloadButton}>
              <AiFillAndroid size={24} />
              <span>Play Store</span>
            </a>
            <a href="#" className={styles.downloadButton}>
              <AiFillApple size={24} />
              <span>App Store</span>
            </a>
          </div>
          <button className={styles.chatbotButton}>
            <FaGem size={20} />
            Chat with Gemini
          </button>
        </div>

        {/* Liens Utiles */}
        <div className={styles.footerLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Destinations</a></li>
            <li><a href="#">Testimonials</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Réseaux Sociaux */}
        <div className={styles.footerSocial}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="#"><FaFacebookF size={18} /></a>
            <a href="#"><FaTwitter size={18} /></a>
            <a href="#"><FaInstagram size={18} /></a>
            <a href="#"><FaLinkedinIn size={18} /></a>
          </div>
        </div>
      </div>

      {/* Informations légales et Copyright */}
      <div className={styles.footerBottom}>
        <p>&copy; 2023 Travelo. All rights reserved.</p>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
}
