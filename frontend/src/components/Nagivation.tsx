"use client";

import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Close menu on mobile
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/image 11.png"
              alt="AgroSmart Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">
              Agro<span className="text-green-600">Smart</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["home", "features", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                {section.charAt(0).toUpperCase() +
                  section.slice(1).replace("Us", " Us")}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("cta")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col items-start space-y-4">
            {["home", "features", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-gray-700 hover:text-green-600 transition-colors w-full text-left"
              >
                {section.charAt(0).toUpperCase() +
                  section.slice(1).replace("Us", " Us")}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("cta")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full w-full text-left"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
