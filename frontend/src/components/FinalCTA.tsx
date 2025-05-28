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
            Join thousands of farmers and buyers already using AgriChain to create a more transparent, fair, and sustainable agricultural marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={scrollToHero}
              className="bg-white text-green-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-full font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started with AgriChain
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2">Secure Transactions</h4>
              <p className="text-sm">Blockchain-powered security for all trades</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">Mobile Ready</h4>
              <p className="text-sm">Access your dashboard anywhere, anytime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-semibold mb-2">Global Reach</h4>
              <p className="text-sm">Connect with farmers and buyers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;