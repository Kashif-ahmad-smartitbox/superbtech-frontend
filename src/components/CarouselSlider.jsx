import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiPause, FiPlay } from "react-icons/fi";

// Import your local images
import slide1 from "../assests/1.png";
import slide2 from "../assests/F1.jpg";
import slide3 from "../assests/F2.jpg";
import slide4 from "../assests/F4.jpg";

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
    {
      id: 4,
      image: slide4,
      title: "Medical Equipment Solutions",
      description: "Advanced medical devices for diagnosis & treatment",
      ctaText: "View Products",
      ctaLink: "/products",
      badge: "Medical",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const promises = slides.map((slide) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = () => {
            setLoadedImages((prev) => ({ ...prev, [slide.id]: true }));
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${slide.image}`);
            resolve();
          };
        });
      });

      await Promise.all(promises);
    };

    loadImages();
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides Container - Optimized height for mobile */}
      <div
        className="relative h-[85vh] md:h-[80vh] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              {loadedImages[slide.id] ? (
                <>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[20000ms] ${
                      index === currentSlide ? "scale-110" : "scale-100"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "low"}
                    sizes="100vw"
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-800 animate-pulse" />
              )}
            </div>

            {/* Content Container - Centered for mobile, right-aligned for desktop */}
            <div className="absolute inset-0 z-20 flex items-end md:items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="w-full md:max-w-xl md:ml-auto mb-20 md:mb-0 animate-fade-in">
                  {/* Badge - Positioned above content on mobile */}
                  <div className="flex justify-center md:justify-start mb-4">
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2 rounded-full shadow-lg border border-white/10">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="bg-gradient-to-b from-black/30 to-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                    {/* Title */}
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center md:text-left leading-tight mb-4">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-xs md:text-base text-gray-200 text-center md:text-left leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Smaller and more subtle on mobile */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 md:p-3.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-30 shadow-xl border border-white/10"
          aria-label="Previous slide"
        >
          <HiChevronLeft size={22} className="md:w-7 md:h-7" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 md:p-3.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-30 shadow-xl border border-white/10"
          aria-label="Next slide"
        >
          <HiChevronRight size={22} className="md:w-7 md:h-7" />
        </button>

        {/* Bottom Controls - Compact for mobile */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30">
          {/* Dots Indicator */}
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg px-4 py-3 rounded-full border border-white/10 shadow-2xl">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 ${
                  index === currentSlide
                    ? "w-8 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Play/Pause */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-black/50 backdrop-blur-lg p-3 rounded-full border border-white/10 shadow-2xl text-white hover:text-primary-300 transition-colors"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
        </div>

        {/* Slide Counter for Mobile - Top Right */}
        <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-lg px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="text-sm text-white font-medium">
            <span className="text-white">{currentSlide + 1}</span>
            <span className="text-white/60"> / {slides.length}</span>
          </span>
        </div>

        {/* Progress Bar - More visible */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 z-20">
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 transition-all duration-100"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 5s linear forwards" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CarouselSlider;
