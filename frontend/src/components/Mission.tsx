const Mission = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-amber-600">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">
            Our Mission
          </h2>
          <p className="text-xl text-white/90 leading-relaxed font-light">
            AgroSmart is reimagining agriculture through technology — enabling fair trade, 
            secure payments, and full transparency from field to fork.
          </p>
          
          <div className="mt-12 flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🚜</span>
              </div>
              <span className="text-white/80 text-sm">Farm</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">📦</span>
              </div>
              <span className="text-white/80 text-sm">Package</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="text-white/80 text-sm">Fork</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;