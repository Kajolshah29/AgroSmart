'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does AgroSmart ensure secure transactions?",
      answer: "AgroSmart uses blockchain technology and smart contracts to ensure secure, transparent transactions. Every trade is recorded on the blockchain, providing an immutable record and automated payment execution through smart contracts."
    },
    {
      question: "What are the benefits for farmers?",
      answer: "Farmers benefit from direct market access, fair pricing, and secure payments. They can list their produce, set their prices, and connect directly with buyers, eliminating middlemen and increasing their profits."
    },
    {
      question: "How do I get started as a buyer?",
      answer: "Simply create an account and verify your identity.You can then browse available produce, place orders, and make secure payments through our platform."
    },
    {
      question: "Is there a minimum order amount?",
      answer: "No, there's no minimum order amount. We support transactions of all sizes, from small local purchases to large commercial orders."
    },
    {
      question: "How is produce quality verified?",
      answer: "Each product listing includes detailed information about farming practices, certifications, and quality standards. Farmers can also provide additional documentation and photos to verify their produce quality."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50/30 to-amber-50/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about AgroSmart
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`px-6 transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100 py-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default FAQ; 
