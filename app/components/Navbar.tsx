"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-sea-blue/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="font-playfair text-xl md:text-2xl text-white font-bold tracking-wide"
          >
            Carpe Diem
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "La Villa", href: "/#villa" },
              { label: "Galerie", href: "/galerie" },
              { label: "Tarifs", href: "/#tarifs" },
              { label: "Contact", href: "/#reserver" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/90 hover:text-gold transition-colors duration-200 font-lato text-sm tracking-wider uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#reserver"
              className="bg-gold hover:bg-gold-light text-white px-5 py-2 rounded font-lato text-sm font-bold tracking-wider uppercase transition-colors duration-200"
            >
              Réserver
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-sea-blue/95 backdrop-blur-sm pb-4">
            {[
              { label: "La Villa", href: "/#villa" },
              { label: "Galerie", href: "/galerie" },
              { label: "Tarifs", href: "/#tarifs" },
              { label: "Contact", href: "/#reserver" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 px-4 text-white/90 hover:text-gold hover:bg-white/10 transition-colors duration-200 font-lato tracking-wider uppercase text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#reserver"
              className="block mx-4 mt-2 text-center bg-gold hover:bg-gold-light text-white py-3 rounded font-lato text-sm font-bold tracking-wider uppercase transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Réserver
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
