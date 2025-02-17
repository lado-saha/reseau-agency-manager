"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../front-styles/HeroSection.module.css";
import Image from "next/image";
const slides = [
  { type: "image",src:"/front/yaounde.jpeg", alt: "Beautiful landscape" },
  { type: "image",src:"/front/douala.jpeg", alt: "Another landscape" },
  { type: "image",src:"/front/museum.jpeg", alt: "Another landscape" },
  { type: "image",src:"/front/gorge.jpeg", alt: "Another landscape" },
  { type: "image",src:"/front/bertoua.jpg", alt: "Another landscape" },
  { type: "image",src:"/front/dschang.jpg", alt: "Another landscape" },
  { type: "image",src:"/front/kribi.jpeg", alt: "Another landscape" },
  { type: "image",src:"/front/unite.jpeg", alt: "Another landscape" },
  { type: "image",src:"/front/chute.jpeg", alt: "Another landscape" },
 
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Changer de slide toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.slider}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
          >
            {slide.type === "image" ? (
              <Image src={slide.src} alt={slide.alt} width={500}  height={460} className={styles.slideMedia} />
            ) : (
              <video autoPlay loop muted className={styles.slideMedia}>
                <source src={slide.src} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Welcome to Travelo</h1>
        <p className={styles.subtitle}>
          Find the best travel agencies and book your next adventure.
        </p>
        <Link href='../recherche' className={styles.getStartedButton}>
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
