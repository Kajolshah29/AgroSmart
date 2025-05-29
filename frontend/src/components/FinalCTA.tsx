'use client';

import { Button } from "./ui/button";
const scrollToHero = () => {
  const section = document.getElementById("home");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
const FinalCTA = () => {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-green-600 via-green-700 to-amber-600">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to trade transparently?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of farmers and buyers already using AgroSmart to create a more transparent, fair, and sustainable agricultural marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={scrollToHero}
              className="bg-white text-green-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-full font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started with AgroSmart
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-medium text-[#ffffff] mb-2">UPI Secure</h4>
              <p className="text-sm text-[#ffff]">Safe & instant payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🗣️</span>
              </div>
              <h4 className="font-medium text-[#ffff] mb-2">Multilingual</h4>
              <p className="text-sm text-[#ffff]">Support in your language</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-medium text-[#ffff] mb-2">Real-time Tracking</h4>
              <p className="text-sm text-[#ffff]">Monitor everything live</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;