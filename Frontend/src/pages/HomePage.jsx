import React from "react";
import {
  HeroSection,
  FeaturesSection,
  TestimonialSection,
  FAQSection,
  CTASection,
  Footer
} from "../components/LandingPageComponents";

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
