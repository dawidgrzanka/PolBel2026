import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'USŁUGI', href: '#uslugi' },
    { name: 'WYNAJEM', href: '#wynajem' },
    { name: 'BLOG', href: '/Blog' },
    { name: 'POLBEL-PLUS', href: '#polbel-plus' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Główna nawigacja">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center" aria-label="POLBEL - Strona główna">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/77fab3149_logo_web26.png" 
              alt="POLBEL Logo" 
              className="h-8 sm:h-10 w-auto"
              width="150"
              height="40"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#kontakt"
              className="bg-[#d4a84b] hover:bg-[#c49a3d] text-black text-sm font-semibold px-6 py-2.5 rounded transition-all duration-200 hover:shadow-lg hover:shadow-[#d4a84b]/20"
            >
              KONTAKT
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-white/10">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-white/90 hover:text-white text-sm font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  href="#kontakt"
                  className="block bg-[#d4a84b] hover:bg-[#c49a3d] text-black text-sm font-semibold px-6 py-2.5 rounded text-center mt-4 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  KONTAKT
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}