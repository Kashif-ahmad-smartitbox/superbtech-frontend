import React, { useState, useEffect, useCallback } from "react"; 
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiPause, FiPlay } from "react-icons/fi";

// Import your local images
import slide1 from "../assests/1.jpg";
import slide2 from "../assests/F1.jpg";
import slide3 from "../assests/F2.jpg";
import slide4 from "../assests/F4.jpg";
import slide5 from "../assests/F5.jpg";
import slide6 from "../assests/F6.jpg";
import slide7 from "../assests/F7.jpg";
import slide8 from "../assests/F8.jpg";

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
        description:
          "Advanced medical devices for diagnosis & treatment",
        ctaText: "View Products",
        ctaLink: "/products",
        badge: "Medical",
      },
      {
        id: 5,
        image: slide5,
        title: "Our more Equipments",
        description:
          "Some more Equipments we provide in our company",
        ctaText: "View Products",
        ctaLink: "/products",
        badge: "Equipments",
      },
      {
        id: 6,
        image: slide6,
        title: "Industrial Testing Solutions",
        description:
          "Reliable equipment for quality control & research facilities",
        ctaText: "Contact Experts",
        ctaLink: "/contact",
        badge: "Industrial",
      },
      {
        id: 7,
        image: slide7,
        title: "Industrial Testing Solutions",
        description:
          "Reliable equipment for quality control & research facilities",
        ctaText: "Contact Experts",
        ctaLink: "/contact",
        badge: "Industrial",
      },
      {
        id: 8,
        image: slide8,
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
  const [loadedImages, setLoadedImages] = useState({});

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
    }, 4000); // Increased interval for better viewing

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Preload and track image loading
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
      {/* Slides Container - Updated height to 80vh for mobile as requested */}
      <div className="relative h-[80vh] md:h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            // Added flex flex-col for mobile, md:block for desktop to restore overlay
            className={`absolute inset-0 transition-all duration-700 flex flex-col md:block ${
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
            {/* Background Image Container */}
            {/* Mobile: h-1/2 relative, Desktop: absolute inset-0 full height */}
            <div className="relative h-1/2 w-full md:absolute md:inset-0 md:h-full">
              {loadedImages[slide.id] ? (
                <>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[15000ms] ${
                      index === currentSlide ? "scale-105" : "scale-100"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "low"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                    style={{
                      imageRendering: loadedImages[slide.id]
                        ? "crisp-edges"
                        : "auto",
                    }}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-800 animate-pulse" />
              )}
            </div>

            {/* Content Container */}
            {/* Mobile: h-1/2 relative bg-gray-900, Desktop: h-full absolute transparent */}
            <div className="relative h-1/2 w-full bg-gray-900 md:bg-transparent md:h-full flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* On mobile center text, on desktop keep original right alignment */}
                <div className="w-full md:max-w-xl md:ml-auto animate-fade-in flex justify-center md:block">
                  <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/30 backdrop-blur-md rounded-2xl py-5 px-6 md:py-6 md:px-7 border border-white/20 shadow-2xl w-full">
                    {/* Badge */}
                    <span className="inline-block text-xs font-semibold tracking-wider uppercase text-secondary-50 bg-gradient-to-r from-secondary-600 to-secondary-700 px-4 py-2 rounded-full mb-3 shadow-lg">
                      {slide.badge}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-lg text-white/90 mb-6 max-w-lg leading-relaxed drop-shadow-md">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      <Link
                        to={slide.ctaLink}
                        className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-w-[120px] md:min-w-[160px] hover:shadow-primary-500/40 active:scale-95 text-sm md:text-base"
                      >
                        <span className="drop-shadow-sm">{slide.ctaText}</span>
                      </Link>
                      <Link
                        to="/quote"
                        className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/40 hover:border-secondary-400 hover:bg-secondary-900/30 transition-all duration-300 min-w-[120px] md:min-w-[160px] hover:text-secondary-50 hover:shadow-lg active:scale-95 text-sm md:text-base"
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

        {/* Navigation Arrows - Kept at middle (top-1/2) */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-primary-900/70 hover:bg-primary-800 text-white p-2 md:p-3.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-20 shadow-2xl border border-white/20"
          aria-label="Previous slide"
        >
          <HiChevronLeft size={20} className="md:w-[26px] md:h-[26px] drop-shadow-sm" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-primary-900/70 hover:bg-primary-800 text-white p-2 md:p-3.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 z-20 shadow-2xl border border-white/20"
          aria-label="Next slide"
        >
          <HiChevronRight size={20} className="md:w-[26px] md:h-[26px] drop-shadow-sm" />
        </button>

        {/* Bottom Controls Container */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
          {/* Dots Indicator */}
          <div className="flex items-center gap-2 bg-primary-900/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-xl">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 ${
                  index === currentSlide
                    ? "bg-secondary-400 scale-125 shadow-lg"
                    : "bg-white/60 hover:bg-secondary-300 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter & Play/Pause */}
          <div className="hidden md:flex items-center gap-3 bg-primary-900/70 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20 shadow-xl">
            <span className="text-sm text-white font-medium drop-shadow-sm">
              <span className="text-white">{currentSlide + 1}</span>
              <span className="text-white/70">/{slides.length}</span>
            </span>

            <div className="w-px h-4 bg-white/30"></div>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-white hover:text-secondary-300 transition-colors p-1"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? (
                <FiPause size={18} className="drop-shadow-sm" />
              ) : (
                <FiPlay size={18} className="drop-shadow-sm" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-900/40 z-10">
          <div
            className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 transition-all duration-100"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 4s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
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

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        /* Improve image rendering */
        img {
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -webkit-transform: translateZ(0) scale(1, 1);
          -moz-transform: translateZ(0) scale(1, 1);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* Prevent blur on scale animation */
        .scale-105 {
          transform: scale(1.05);
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};

export default CarouselSlider;
