'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const images = [
  { id: 1, url: '/91728.jpg', width: 1920, height: 1080, title: 'image 1' },
  { id: 2, url: '/91731.jpg', width: 1920, height: 1080, title: 'image 2' },
  { id: 3, url: '/91732.jpg', width: 1920, height: 1080, title: 'image 3' },
];

export interface ImageType {
  url: string;
  height: number;
}

export default function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 5000); // setiap 5 detik

    return () => clearInterval(interval); // bersihkan interval ketika komponen diunmount
  }, [currentIndex, images.length]);

  return (
    <div className='bg-[#514e4e] bg-opacity-70'>
      <Image
        key={images[currentIndex].id}
        src={images[currentIndex].url}
        width={images[currentIndex].width}
        height={images[currentIndex].height}
        alt={images[currentIndex].title}
        priority
        className='animate-blink w-full object-cover h-[771px] max-h-screen object-center'
        sizes='100vw'
      />
    </div>
  );
}
