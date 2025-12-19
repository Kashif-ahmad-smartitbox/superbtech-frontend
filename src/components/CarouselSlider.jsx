import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiPause, FiPlay } from "react-icons/fi";

// Import your local images
import slide1 from "../assests/01.jpeg";
import slide2 from "../assests/02.jpeg";
import slide3 from "../assests/03.jpeg";

const CarouselSlider = () => {
  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Precision Laboratory Instruments",
      description:
        "Advanced testing equipment for scientific & industrial applications",
      ctaText: "View Products",
      ctaLink: "/products",
      badge: "Lab Equipment",
    },
    {
      id: 2,
      image: slide2,
      title: "Technical Education Systems",
      description:
        "Comprehensive solutions for engineering & vocational training",
      ctaText: "Browse Catalog",
      ctaLink: "/catalog",
      badge: "Education",
    },
    {
      id: 3,
      image: slide3,
      title: "Industrial Testing Solutions",
      description:
        "Reliable equipment for quality control & research facilities",
      ctaText: "Contact Experts",
      ctaLink: "/contact",
      badge: "Industrial",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides Container */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Background Image with Subtle Zoom */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover transition-transform duration-[10000ms] ${
                  index === currentSlide ? "scale-105" : "scale-100"
                }`}
                loading="eager"
              />

              {/* Professional Gradient Overlay with Primary Color */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/30 to-primary-950/60" />
            </div>

            {/* Content - Positioned on Right for Better Balance */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-xl lg:max-w-2xl ml-auto">
                  <div className="bg-gradient-to-r from-primary-900/40 to-primary-800/20 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
                    {/* Badge - Using Secondary Color */}
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase text-secondary-50 bg-secondary-700/50 px-3 py-1.5 rounded-full mb-6">
                      {slide.badge}
                    </span>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-white/90 mb-8 max-w-lg">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={slide.ctaLink}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-[160px] hover:shadow-primary-500/30"
                      >
                        {slide.ctaText}
                      </Link>
                      <Link
                        to="/quote"
                        className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-white/30 hover:border-secondary-400 hover:bg-secondary-900/20 transition-all duration-300 min-w-[160px] hover:text-secondary-50"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Using Primary Color */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-900/60 hover:bg-primary-800/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-400/50 z-20"
          aria-label="Previous slide"
        >
          <HiChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-900/60 hover:bg-primary-800/80 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-400/50 z-20"
          aria-label="Next slide"
        >
          <HiChevronRight size={24} />
        </button>

        {/* Bottom Controls Container */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
          {/* Dots Indicator */}
          <div className="flex items-center gap-2 bg-primary-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-400/20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary-300 disabled:opacity-50 ${
                  index === currentSlide
                    ? "bg-secondary-400 scale-125"
                    : "bg-white/50 hover:bg-secondary-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter & Play/Pause */}
          <div className="flex items-center gap-3 bg-primary-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-primary-400/20">
            <span className="text-sm text-white">
              <span className="font-medium">{currentSlide + 1}</span>
              <span className="text-white/60">/{slides.length}</span>
            </span>

            <div className="w-px h-4 bg-primary-300/30"></div>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-white hover:text-secondary-300 transition-colors"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
            </button>
          </div>
        </div>

        {/* Progress Bar - Using Gradient from Primary to Secondary */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-900/30 z-10">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-100"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 6s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        /* Fade-in animation for content */
        .slide-content {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CarouselSlider;
