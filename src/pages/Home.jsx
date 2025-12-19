import React from "react";
import AboutSection from "../components/AboutSection";
import CarouselSlider from "../components/CarouselSlider";
import CategoriesSection from "../components/CategoriesSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";

function Home() {
  return (
    <>
      <CarouselSlider />
      <AboutSection />
      <ProductShowcaseSection />
      <CategoriesSection />
    </>
  );
}

export default Home;
