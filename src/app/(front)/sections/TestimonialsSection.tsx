// app/sections/ClientTestimonialsSection.tsx

import styles from '../../front-styles/ClientTestimonialsSection.module.css';
import Image from 'next/image';

const ClientTestimonialsSection = () => {
  const testimonials = [
    {
      avatar: "/3.jpg", // Remplacez par le chemin de vos images
      name: "Emma L.",
      location: "Berlin, Germany",
      feedback: "Travelo made our honeymoon unforgettable! The itinerary was seamless, and we felt very taken care of.",
      rating: 5
    },
    {
      avatar: "/3.jpg",
      name: "John D.",
      location: "New York, USA",
      feedback: "Amazing service! From booking to support, everything was handled perfectly. Highly recommend!",
      rating: 4
    },
    {
      avatar: "/3.jpg",
      name: "Aisha K.",
      location: "Dubai, UAE",
      feedback: "The best travel agency experience I&quot;ve had. Personalized planning and exclusive deals were top-notch!",
      rating: 5
    },
    {
      avatar: "/3.jpg",
      name: "Carlos R.",
      location: "Madrid, Spain",
      feedback: "Great customer service! I encountered no issues during my travels, thanks to Travelo support team.",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What Our Clients Say</h2>
        <ul className={styles.testimonialsList}>
          {testimonials.map((testimonial, index) => (
            <li key={index} className={styles.testimonialItem}>
              <Image src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} width={500}  height={460} className={styles.avatar} />
              <div className={styles.testimonialContent}>
                <div className={styles.header}>
                  <h3 className={styles.clientName}>{testimonial.name}</h3>
                  <span className={styles.location}>{testimonial.location}</span>
                </div>
                <div className={styles.rating}>
                  {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
                </div>
                <p className={styles.feedback}>{testimonial.feedback}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientTestimonialsSection;
