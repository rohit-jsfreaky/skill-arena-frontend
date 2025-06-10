import React, { useState, useEffect, useRef } from "react";
import "./Slider.css";

interface BannerSliderProps {
  images: string[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return ( 
    <div className="relative rounded-2xl w-full overflow-hidden h-40 z-[10]">
      <div
        ref={sliderRef}
        className="flex w-full transition-transform duration-500 ease-in-out transform-3d"
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full rounded-2xl flex-shrink-0 object-fill h-40 transform-3d"
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
