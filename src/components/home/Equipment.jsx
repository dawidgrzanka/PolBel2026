import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ChevronRight } from 'lucide-react';

export default function Equipment() {
  const equipment = [
    {
      name: 'Koparki Gąsienicowe',
      weight: '2t-14t RCF',
      features: ['Pełne wyposażenie', 'Certyfikat sprawności', 'Ubezpieczenie OC'],
      available: true,
    },
    {
      name: 'Koparko-Ładowarki',
      weight: 'Różne modele',
      features: ['Łyżki wymienne', 'Widły paletowe', 'Młoty hydrauliczne'],
      available: true,
    },
    {
      name: 'Walce i Zagęszczarki',
      weight: 'Kompaktowe i ciężkie',
      features: ['Wibracyjne', 'Statyczne', 'Płyty wibracyjne'],
      available: true,
    },
  ];

  return (
    <section 
      id="wynajem" 
      className="py-20 md:py-32 bg-[#1a1a1a]"
      aria-labelledby="equipment-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="equipment-heading"
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Wypożyczalnia <span className="text-[#d4a84b]">Sprzętu</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            Profesjonalny sprzęt budowlany na wynajem z pełnym serwisem i wsparciem technicznym
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {equipment.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#2a2a2a] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/5 hover:border-[#d4a84b]/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#d4a84b] transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#d4a84b] font-medium">
                    {item.weight}
                  </p>
                </div>
                {item.available && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    Dostępne
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                    <ChevronRight className="w-4 h-4 text-[#d4a84b]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-[#d4a84b] hover:text-[#e6007e] font-medium text-sm transition-colors active:scale-[0.98] touch-manipulation"
              >
                Zapytaj o cenę
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Map / Location Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-2 gap-8 items-center"
        >
          <div className="bg-[#2a2a2a] rounded-2xl p-6 md:p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">
              Obszar Działania
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#d4a84b] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Siedziba główna</p>
                  <p className="text-white/60 text-sm">Polska, woj. podkarpackie</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#d4a84b] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Godziny pracy</p>
                  <p className="text-white/60 text-sm">Pon-Pt: 7:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#d4a84b] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Kontakt telefoniczny</p>
                  <p className="text-white/60 text-sm">Dostępny całą dobę</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden h-64 md:h-80">
            <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#d4a84b] mx-auto mb-4" />
                <p className="text-white/60 text-sm">Obszar działania: 40+ km</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}