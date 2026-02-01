import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    uslugi: [
      { name: 'Brukarstwo', href: '#uslugi' },
      { name: 'Prace ziemne', href: '#uslugi' },
      { name: 'Instalacje WOD-KAN', href: '#uslugi' },
      { name: 'Wynajem sprzętu', href: '#wynajem' },
    ],
    firma: [
      { name: 'O nas', href: '#' },
      { name: 'Realizacje', href: '#' },
      { name: 'Kariera', href: '#' },
      { name: 'Kontakt', href: '#kontakt' },
    ],
  };

  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_697f79bcdbd72dfd1e046dd6/77fab3149_logo_web26.png" 
              alt="POLBEL Logo" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/60 text-sm max-w-md">
              Budujemy solidność od ponad 15 lat. Kompleksowe usługi budowlane, 
              brukarskie i instalacyjne na terenie całego Podkarpacia.
            </p>
          </div>

          {/* Services Links */}
          <nav aria-label="Usługi">
            <h4 className="font-semibold text-[#d4a84b] mb-4 text-sm tracking-wider">
              USŁUGI
            </h4>
            <ul className="space-y-3">
              {links.uslugi.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-label="Firma">
            <h4 className="font-semibold text-[#d4a84b] mb-4 text-sm tracking-wider">
              FIRMA
            </h4>
            <ul className="space-y-3">
              {links.firma.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} POLBEL. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Polityka prywatności
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
              Regulamin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}