import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Karan Joshi",

    role: "Verified Buyer",
    content:
      "Bought a pair of wireless earbuds and they are fantastic! Sound quality is top-notch and battery life is impressive.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rishi Jivrajani",

    role: "Verified Buyer",
    content:
      "The mobile case I ordered fits perfectly and looks stylish. Definitely shopping again!",
    rating: 4,
  },
  {
    id: 3,
    name: "Paras Sapariya",

    role: "Verified Buyer",
    content:
      "Fast delivery and great quality! Got a smartwatch, and it's exactly as described. Very happy with my purchase!",
    rating: 5,
  },
  {
    id: 4,
    name: "Amit Soni",

    role: "Verified Buyer",
    content:
      "The charging cable I bought is super durable and works perfectly. Highly recommend!",
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleTestimonials(1);
      } else if (window.innerWidth < 1024) {
        setVisibleTestimonials(2);
      } else {
        setVisibleTestimonials(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, testimonials.length - visibleTestimonials)
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const showLeftArrow = currentIndex > 0;
  const showRightArrow =
    currentIndex < testimonials.length - visibleTestimonials;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="relative">
          {showLeftArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {showRightArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-100 rounded-full w-8 h-8"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              initial={false}
              animate={{
                x: `calc(-${currentIndex * (100 / visibleTestimonials)}% - ${
                  currentIndex * 1.5
                }rem)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {testimonial.content}
                    </p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
