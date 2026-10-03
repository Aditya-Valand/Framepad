"use client";

import { useEffect, useRef } from "react";
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
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // ── 1. Reveal: blur + translate + fade ─────────────────────────
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObs.observe(el));

    // ── 2. Stagger: children animate in with cascading delay ────────
    const staggerContainers = document.querySelectorAll<HTMLElement>(".reveal-stagger");
    const staggerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            Array.from(e.target.children).forEach((child, i) => {
              const el = child as HTMLElement;
              el.classList.add("stagger-item");
              // Stagger delay: 90ms per child, capped at 500ms
              const delay = Math.min(i * 90, 500);
              requestAnimationFrame(() => {
                el.style.transitionDelay = `${delay}ms`;
                requestAnimationFrame(() => el.classList.add("stagger-visible"));
              });
            });
            staggerObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    staggerContainers.forEach((el) => staggerObs.observe(el));

    // ── 3. Parallax: subtle scroll-depth on [data-parallax] ─────────
    const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]");
    parallaxEls.forEach((el) => { el.style.willChange = "transform"; });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        parallaxEls.forEach((el) => {
          const rate = parseFloat(el.dataset.parallax ?? "0.15");
          const rect = el.getBoundingClientRect();
          // Only animate when element is near viewport
          if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
            const offset = (rect.top + rect.height * 0.5 - window.innerHeight * 0.5);
            el.style.transform = `translateY(${offset * rate * -1}px)`;
          }
        });
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial call

    return () => {
      revealObs.disconnect();
      staggerObs.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
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
