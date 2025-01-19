"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ShoppingFooter() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
      <div
        className={`container mx-auto px-4 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-center items-center space-x-1 text-sm">
          <span className="text-gray-600 text-lg">© {year} Raj Telecom</span>
          <span className="text-gray-600 text-lg">Created by</span>
          <a
            href="https://www.instagram.com/deep.2531/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300 relative group"
          >
            Deep Soni
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
