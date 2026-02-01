import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const stats = [
    { value: '15+', label: 'LAT DOŚWIADCZENIA' },
    { value: '40+', suffix: 'KM', label: 'OBSZAR DZIAŁANIA' },
    { value: '100%', label: 'WŁASNY SPRZĘT' },
  ];

  return (
    <section 
      className="relative min-h-screen flex flex-col"
      aria-labelledby="hero-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source 
            media="(max-width: 640px)" 
            srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/3db7c8c33_Gemini_Generated_Image_z6mr8mz6mr8mz6mr.png?width=640&quality=75"
          />
          <source 
            media="(max-width: 1024px)" 
            srcSet="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/3db7c8c33_Gemini_Generated_Image_z6mr8mz6mr8mz6mr.png?width=1024&quality=80"
          />
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/3db7c8c33_Gemini_Generated_Image_z6mr8mz6mr8mz6mr.png"
            alt="Koparka na budowie - profesjonalne usługi budowlane POLBEL"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50 sm:from-black/80 sm:via-black/60 sm:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Yellow accent bar at top */}
      <div className="absolute top-0 right-0 w-1/3 h-1 bg-gradient-to-r from-transparent via-[#d4a84b] to-[#d4a84b] z-10" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              BUDUJEMY<br />
              <span className="text-white">SOLIDNOŚĆ.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl">
              Kompleksowe Realizacje Ziemne, Brukarskie i Instalacyjne
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#kontakt"
                className="inline-flex items-center justify-center bg-[#e6007e] hover:bg-[#c70069] text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded transition-all duration-300 hover:shadow-lg hover:shadow-[#e6007e]/30 text-sm tracking-wide active:scale-[0.98] touch-manipulation"
              >
                UMÓW KONSULTACJĘ
              </a>
              <a
                href="#wynajem"
                className="inline-flex items-center justify-center border-2 border-white/30 hover:border-white/60 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded transition-all duration-300 hover:bg-white/5 text-sm tracking-wide active:scale-[0.98] touch-manipulation"
              >
                WYPOŻYCZ SPRZĘT
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="py-5 sm:py-8 md:py-12 px-2 sm:px-4 text-center md:text-left md:pl-8 relative"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#d4a84b] hidden md:block" />
                <div className="flex items-baseline justify-center md:justify-start gap-0.5 sm:gap-1">
                  <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4a84b]">
 