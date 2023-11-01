import Image from 'next/image';
import React from 'react';

export default function ImageResult({
  imageUrl,
  imageTitle,
  percentage,
  isFullWidth,
}: {
  imageUrl: string;
  imageTitle: string;
  percentage: number;
  isFullWidth?: boolean;
}) {
  return (
    <div
      className={`bg-transparent border-[#dbb88b] w-full relative max-w-[500px] aspect-[5/3] rounded-xl animate-blink`}
    >
      <Image
        src={imageUrl}
        alt={imageTitle}
        width={1920}
        height={1020}
        className='w-full h-full object-cover object-center'
      />
      <p
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, #343149 20.33%, rgba(0, 0, 0, 0.00) 99.48%)',
        }}
        className='p-4 lg:p-8 font-poppins text-[#dbb88b] text-xl font-bold absolute z-10 left-1/2 -translate-x-1/2 bottom-2'
      >
        {percentage}%
      </p>
      <p
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, #343149 20.33%, rgba(0, 0, 0, 0.00) 99.48%)',
        }}
        className='p-4 lg:p-8 font-poppins text-white text-xl font-bold absolute z-10 right-1 top-1'
      >
        {imageTitle}
      </p>
    </div>
  );
}
