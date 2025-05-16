import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';

// props: banners = [{id, imgUrl}]
const CarouselBanner = ({ banners }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 24,
      }}
    >
      <Carousel autoplay autoplaySpeed={3000} dots>
        {banners.map((item, idx) => (
          <div
            key={item.id}
            style={{
              cursor: 'pointer',
              background: '#f5f5f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 240,
            }}
            onClick={() => navigate(`/notes/${item.id}`)}
          >
            <img
              src={item.imgUrl}
              alt={`banner-${idx}`}
              style={{
                width: '100%',
                height: 240,
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
