import React from "react";
import {
  Shield,
  Truck,
  CreditCard,
  RotateCcw,
  CheckCircle,
  Headset,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your data is protected with advanced encryption.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your products delivered within 2-3 business days.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment options for your convenience.",
  },
  {
    icon: Headset,
    title: "24/7 Customer Support",
    description: "Our team is here to assist you anytime with your queries.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
