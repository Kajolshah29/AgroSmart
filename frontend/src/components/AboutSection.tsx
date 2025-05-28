const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-green-50/30 to-amber-50/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="w-24 h-1 bg-green-600 rounded mb-8"></div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  AgriChain uses technology to create an equitable ecosystem where farmers can list their produce transparently and buyers can trust what they purchase.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <span className="text-gray-700">Farmer lists produce with transparent details</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <span className="text-gray-700">Blockchain records create immutable trail</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <span className="text-gray-700">Buyer purchases with smart contract security</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🚜</span>
                    </div>
                    <p className="text-sm text-gray-600">Farmer</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <p className="text-sm text-gray-600">Marketplace</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Transparent Trade</h4>
                  <p className="text-gray-600 text-sm">Every transaction is secure, traceable, and fair for all parties involved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;