import React, { useState, useEffect } from 'react';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './carouselComponent.module.css';
import '../../styles/styles.scss';
import Link from 'next/link';
import Cookies from 'js-cookie';

const CarouselComponent = ({ className, carouselItems, centerbanners }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
 

  useEffect(() => {
    const token = Cookies.get('token') || null;
    const filteredItems = Array.isArray(carouselItems) ? (
      token
        ? carouselItems.filter(item => item.status === 1)
        : carouselItems.filter(item => item.visibility === 'public')
    ) : [];
    setVisibleItems(filteredItems);
  }, [carouselItems]);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === visibleItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? visibleItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const renderCarouselItems = () => {
    if (visibleItems.length === 0) {
      return <div>No data</div>;
    }

    return centerbanners?.map((item, index) => (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={index}
      >
        {/* <Link href={item.link}> */}
          <img className="d-block w-100" 
          
          src={item?.src} alt={`Slide `} />
        {/* </Link> */}
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      </CarouselItem>
    ));
  };

  if (visibleItems.length === 0) {
    return <div style={{ color: 'white' }}>No data</div>;
  }

  return (
    <div className={`${styles.carouselContainer} ${className}`}>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
       
      >
        <CarouselIndicators items={visibleItems} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {renderCarouselItems()}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
