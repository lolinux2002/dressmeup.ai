'use client';

import Hero from './components/Hero';
import Features from './components/Features';
import TryOnSection from './components/TryOnSection';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <Hero />
      <Features />
      <TryOnSection />
    </div>
  );
}
