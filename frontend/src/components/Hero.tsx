"use client";

import { Button } from "./ui/button";
import Link from 'next/link'

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50/50 via-white to-amber-50/30 pt-20"
    >
      <div className="container mx-auto px-6 text-center max-w-6xl">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Empowering Farmers.
            <br />
            <span className="text-green-600">Connecting Buyers.</span>
            <br />
            <span className="text-amber-600">Built on Blockchain.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            A transparent, secure, and fair way to trade fresh produce.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link href="/register?type=farmer">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Join as Farmer
              </Button>
            </Link>
            <Link href="/register?type=buyer">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-10 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                Join as Buyer
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                role="img"
                aria-label="Farm"
              >
                <span className="text-3xl">🚜</span>
              </div>
              <span className="text-gray-600 font-medium">Farm</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4"
                role="img"
                aria-label="Blockchain"
              >
                <span className="text-3xl">🔗</span>
              </div>
              <span className="text-gray-600 font-medium">Blockchain</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                role="img"
                aria-label="Table"
              >
                <span className="text-3xl">🍽️</span>
              </div>
              <span className="text-gray-600 font-medium">Table</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
