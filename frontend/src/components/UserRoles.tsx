"use client";

import { useState } from "react";

type RoleKey = "farmer" | "buyer" ;

const roles = {
  farmer: {
    title: "Farmer Dashboard",
    features: [
      "List products with detailed information",
      "Track buyer interactions",
      "View transaction history",
      "Manage inventory",
    ],
    icon: "🚜",
  },
  buyer: {
    title: "Buyer Dashboard",
    features: [
      "Browse verified produce",
      "Smart contract checkout",
      "Track order delivery",
      "Rate and review sellers",
    ],
    icon: "🛒",
  },
} as const;

const UserRoles = () => {
  const [activeTab, setActiveTab] = useState<RoleKey>("farmer");

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Built for Everyone</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded mb-6" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tailored experiences for farmers, buyers, and administrators
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center mb-8 space-x-2">
            {(Object.keys(roles) as RoleKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                aria-pressed={activeTab === key}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === key
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-green-50"
                }`}
              >
                {roles[key].icon} {roles[key].title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{roles[activeTab].icon}</div>
              <h3 className="text-3xl font-bold text-gray-900">
                {roles[activeTab].title}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {roles[activeTab].features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRoles;
