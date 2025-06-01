import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export interface Slide {
  title: string;
  description: string;
  image: string;
}

interface SliderProps {
  slides: Slide[];
  interval?: number;
  className?: string;
}

export function Slider({ slides, interval = 5000, className }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-white/90 mb-6">
            {slides[currentSlide].description}
          </p>
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}