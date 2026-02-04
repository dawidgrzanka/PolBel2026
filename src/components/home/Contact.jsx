import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section 
      id="kontakt" 
      className="py-20 md:py-32 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 
            id="contact-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Skontaktuj się z <span className="text-[#e6007e]">nami</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Umów się z nami i otrzymaj wycenę projektu
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Imię i nazwisko
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#d4a84b] focus:ring-[#d4a84b] text-base"
                    placeholder="Jan Kowalski"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 border-gray-200 focus:border-[#d4a84b] focus:ring-[#d4a84b] text-base"
                    placeholder="+48 123 456 789"
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-gray-200 focus:border-[#d4a84b] focus:ring-[#d4a84b] text-base"
                  placeholder="jan@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Wiadomość
                </label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border-gray-200 focus:border-[#d4a84b] focus:ring-[#d4a84b] resize-none text-base min-h-[120px]"
                  placeholder="Opisz swój projekt..."
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 bg-[#e6007e] hover:bg-[#c70069] text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#e6007e]/30 active:scale-[0.98] touch-manipulation text-base"
                disabled={submitted}
              >
                {submitted ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Wiadomość wysłana!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Wyślij wiadomość
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-8"
          >
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 h-full">
              <h3 className="text-xl font-bold text-white mb-8">
                Informacje kontaktowe
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#d4a84b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#d4a84b]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Telefon</p>
                    <a href="tel:+48882193371" className="text-white font-medium hover:text-[#d4a84b] transition-colors">
                      +48 882 193 371 |
                    </a> 
                    <a href="tel:+48692376235" className="text-white font-medium hover:text-[#d4a84b] transition-colors">
                      +48 692 376 235
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#d4a84b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#d4a84b]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <a href="mailto:biuro@polbel.pl" className="text-white font-medium hover:text-[#d4a84b] transition-colors">
                      biuro@polbel.pl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#d4a84b]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#d4a84b]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Adres</p>
                    <p className="text-white font-medium">
                      ul. Wąska 13<br />
                      57-250 Złoty Stok, Polska
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-white/60 text-sm mb-4">Obserwuj nas</p>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-white/10 hover:bg-[#d4a84b] rounded-lg flex items-center justify-center text-white text-xs font-medium transition-all duration-300"
                      aria-label={`POLBEL na ${social}`}
                    >
                      {social[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}