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
      description: 'Nowoczesny sprzęt budowlany do każdego zadania',
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
      title: 'Licencje i Uprawnienia',
      description: 'Certyfikowani specjaliści z pełnymi uprawnieniami',
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
      title: 'Instalacje WOD-KAN',
      description: 'Kompleksowe instalacje wodno-kanalizacyjne',
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
 