import React from "react";
import "./carousel.css"; 

interface GamesCarouselProps {
  GamesSliderImages: string[];
}

const GamesCarousel: React.FC<GamesCarouselProps> = ({ GamesSliderImages }) => {
  return (
    <div className="carousel-container">
     
      <div className="carousel-track py-10">
        {[...GamesSliderImages, ...GamesSliderImages].map((image, index) => (
          <img key={index} src={image} alt="" className="carousel-item h-20 cursor-pointer hover:scale-105 transition delay-100 ease-in-out" />
        ))}
      </div>
    </div>
  );
};

export default GamesCarousel;
