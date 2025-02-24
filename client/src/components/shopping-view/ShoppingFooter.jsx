"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

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
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto">
      <div
        className={`container mx-auto px-4 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Raj Telecom</h3>
            <p className="text-sm text-gray-600">
              Your trusted mobile accessory store
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://wa.me/919316354141"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors duration-300"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/share/152E3Hdff5/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/raj_telecom_rajkot/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {year} Raj Telecom. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Created by{" "}
            <a
              href="https://www.instagram.com/deep.2531/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 transition-colors duration-300 relative group"
            >
              Deep Soni
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
