import { useState, useEffect } from "react";
import slideShow1 from "../../assets/imagesForSlide/BlinZoSlideshow.png";
import slideShow2 from "../../assets/imagesForSlide/blinzoslideshowclassic.png";
import "./Home.css";
import Product from "../product/Product";
import { useNavigate } from "react-router-dom";



export default function Home() {
  const slides = [slideShow1, slideShow2];
  const [current, setCurrent] = useState(0);
  let nav=useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <>
      <div className="slideshow-container">
        <img
          src={slides[current]}
          alt={`slide-${current}`}
          className="slide-image"
        />
      </div>
    <h1 className="trending">Trending Products</h1>
      <div className="wrapper">
        <Product filterType="Trending" />
      </div>
      <div className="outer">
        <button className="see-more" onClick={()=>nav("/products")}>See more</button>
   
      </div>
  </>
  );
}
