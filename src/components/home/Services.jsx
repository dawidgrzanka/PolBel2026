import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Truck, Shovel, Shield, Leaf, Droplets, Building, Users } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Brukarstwo & Drogi',
      description: 'Profesjonalne układanie kostki brukowej, budowa dróg i chodników',
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7?w=400&h=400&fit=crop&auto=format&q=75',
      featured: true,
    },
    {
      title: 'Własny Park Maszyn',
      description: 'Nowoczesny sprzęt potrzebny do realizacji każdego projektu',
      icon: Truck,
      featured: false,
    },
    {
      title: 'Prace Ziemne',
      description: 'Wykopy, niwelacja terenu, przygotowanie pod budowę',
      icon: Shovel,
      featured: false,
    },
    {
      title: 'Gwarancja Technologii',
      description: 'Najwyższa jakość wykonania z gwarancją',
      icon: Shield,
      featured: false,
    },
    {
      title: 'Instalacje WOD-KAN',
      description: 'Kompleksowe instalacje wodno-kanalizacyjne oparte na nowoczesnych technologiach oraz zgrzewach elektrooporowych',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&auto=format&q=75',
      featured: true,
    },
    {
      title: 'POLBEL-PLUS: Eko System',
      description: 'Ekologiczne rozwiązania dla środowiska',
      icon: Leaf,
      color: 'bg-green-600',
      featured: false,
    },
    {
      title: 'Remonty',
      description: 'Kompleksowe remonty budynków i przestrzeni zewnętrznych',
      icon: Droplets,
      featured: false,
    },
  ];

  return (
    <section 
      id="uslugi" 
      className="py-20 md:py-32 bg-white"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="services-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Dlaczego <span className="text-[#e6007e]">POLBEL</span>?
          </h2>
        </motion.div>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl ${
                service.featured ? 'row-span-2' : ''
              } ${service.color || 'bg-gray-100'}`}
            >
              {service.image ? (
                <div className="relative h-full min-h-[180px] sm:min-h-[200px] md:min-h-[280px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 hidden md:block">
                      {service.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between min-h-[120px] sm:min-h-[140px] md:min-h-[160px] ${
                  service.color ? 'text-white' : 'hover:bg-gray-50'
                }`}>
                  <service.icon 
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${
                      service.color ? 'text-white/90' : 'text-[#d4a84b]'
                    }`} 
                  />
                  <div className="mt-3 sm:mt-4">
                    <h3 className={`text-xs sm:text-sm md:text-base font-bold leading-tight ${
                      service.color ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.title}
                    </h3>
                    <p className={`mt-1 text-xs ${
                      service.color ? 'text-white/80' : 'text-gray-600'
                    } hidden md:block`}>
                      {service.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Golden border accent on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4a84b] rounded-2xl transition-colors duration-300 pointer-events-none" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}