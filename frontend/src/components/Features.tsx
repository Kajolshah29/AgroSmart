const Features = () => {
  const features = [
    {
      icon: "🌱",
      title: "Direct Trade",
      description: "No middlemen, more profit for farmers. Connect directly and keep more of what you earn."
    },
    {
      icon: "🔗",
      title: "Blockchain Traceability",
      description: "Every product is verified from farm to fork with immutable blockchain records."
    },
    {
      icon: "💼",
      title: "Smart Contracts",
      description: "Secure payments and digital proof of transaction with automated contract execution."
    },
    {
      icon: "🧠",
      title: "AI Assistance",
      description: "Built-in chatbot for farming & trade questions to guide you through the process."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Why Choose AgriChain?
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionary features that transform how agricultural trading works
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-green-50/30 hover:from-green-50 hover:to-amber-50/30 transition-all duration-500 hover:shadow-xl hover:scale-105 group"
            >
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
