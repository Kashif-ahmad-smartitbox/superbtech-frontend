import React, { useState, useEffect, useRef } from "react";

const ScrollAnimatedItem = ({ 
  children, 
  className = "", 
  delay = 0,
  animationType = "fade-left", // "fade-left", "fade-up", "scale-up"
  threshold = 0.2
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getAnimationClasses = () => {
    if (isVisible) {
      if (animationType === "scale-up") return "opacity-100 scale-100 translate-y-0";
      if (animationType === "fade-up") return "opacity-100 translate-y-0";
      return "opacity-100 translate-x-0"; // default fade-left
    }
    
    if (animationType === "scale-up") return "opacity-0 scale-95 translate-y-8";
    if (animationType === "fade-up") return "opacity-0 translate-y-12";
    return "opacity-0 -translate-x-12"; // default fade-left
  };

  return (
    <div
      ref={domRef}
      className={`${className} transition-all duration-1000 ease-out transform ${getAnimationClasses()}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimatedItem;
