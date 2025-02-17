'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const BestAgency = () => {

    const slides = [
        {
          image: "/front/general.jpeg",
          title: "General voyage",
          description: "L'agence General voyages veritable joyau du transport inter-urbain au Cameroun."
        },
        {
          image: "/front/global.jpeg",
          title: "Global voyage",
          description: "L'agence Global voyages nouveau bijou du transport inter-urbain au Cameroun."
        },
        {
          image: "/front/touristique.jpg",
          title: "Touristique express",
          description: "L'agence Touristiques Express veritable joyau du transport inter-urbain au Cameroun."
        }
      ] ;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full pt-10 pb-10 max-w-4xl mx-auto"> 
      {/* Container principal */}
      <div className="flex justify-center pt-10 pb-10">
         <h1 className="text-3xl color-blue-900 font-bold"> Les meilleures agences</h1>
      </div>
      <div 
        className="relative h-96 overflow-hidden rounded-lg shadow-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Image et contenu */}
        <div className="relative h-full">
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            width={500}  height={460}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient pour le texte */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-2xl font-bold mb-2">
              {slides[currentIndex].title}
            </h3>
            <p className="text-white/90">
              {slides[currentIndex].description}
            </p>
          </div>
        </div>

        {/* Boutons de navigation */}
        <button 
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Indicateurs */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestAgency;