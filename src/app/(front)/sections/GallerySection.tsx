"use client"
import { useState, useEffect, } from 'react';
import styles from '../../front-styles/DestinationsCarousel.module.css';
import Image from 'next/image';

const initialDestinations = [
  {
    image: "/front/5.jpg",
    title: "Douala",
    description: "La ville dynamique et industrielle du Cameroun.",
  },
  {
    image: "/front/6.jpg",
    title: "Limbe",
    description: "La capitale politique, riche en culture et histoire.",
  },
  {
    image: "/front/3.jpg",
    title: "Kribi",
    description: "Plages magnifiques et eaux claires.",
  },
  {
    image: "/front/4.jpg",
    title: "Bafoussam",
    description: "Le cœur du patrimoine Bamiléké.",
  },
  {
    image: "/front/7.jpg",
    title: "Yaoundé",
    description: "La capitale politique, riche en culture et histoire.",
  },
  {
    image: "/front/8.jpg",
    title: "Mora",
    description: "Plages magnifiques et eaux claires.",
  },
  
];

const DestinationsCarousel = () => {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [isLoading, setIsLoading] = useState(true);
  /*const carouselRef = useRef<HTMLDivElement>(null);*/

  const moveToNextSlide = () => {
    // Déplace le premier élément à la fin
    setDestinations((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const moveToPreviousSlide = () => {
    // Déplace le dernier élément au début
    setDestinations((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
  };

  // Simulation du chargement des images
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(moveToNextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.title}>Nos Destinations</h2>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselSlide}>
        {destinations.map((destination, index) => (
      <div 
    className={styles.card} 
    key={index}
  >
    {isLoading ? (
      <div className={styles.skeletonCard}></div>
    ) : (
      <>
        <div className={styles.cardImageWrapper}>
          <Image
            src={destination.image}
            alt={destination.title}
            width={500}  height={460}
            className={styles.image}
          />
          {/* Ajout du contenu affiché au survol */}
          <div className={styles.overlay}>
            <p>{destination.description}</p>
            <button className={styles.moreInfoButton}>Reserver</button>
          </div>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{destination.title}</h3>
          <p className={styles.cardDescription}>{destination.description}</p>
        </div>
      </>
    )}
  </div>
))}

        </div>
      </div>

      <div className={styles.navigation}>
        <button className={styles.arrowLeft} onClick={moveToPreviousSlide}>❮</button>
        <button className={styles.arrowRight} onClick={moveToNextSlide}>❯</button>
      </div>
    </section>
  );
};

export default DestinationsCarousel;
