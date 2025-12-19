import React from "react";
import AboutSection from "../components/AboutSection";
import CarouselSlider from "../components/CarouselSlider";
import CategoriesSection from "../components/CategoriesSection";

function Home() {
  return (
    <>
      <CarouselSlider />
      <AboutSection />
      <CategoriesSection />
    </>
  );
}

export default Home;
