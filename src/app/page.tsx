"use client";

import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import DarkSection from "@/components/landing/DarkSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import MomentsSection from "@/components/landing/MomentsSection";
import StepsSection from "@/components/landing/StepsSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ background: "var(--cream)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <DarkSection />
      <TemplatesSection />
      <MomentsSection />
      <StepsSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
