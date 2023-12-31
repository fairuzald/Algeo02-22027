import Image from 'next/image';
import React from 'react';

export default function ImageResult({
  imageUrl,
  imageTitle,
  percentage,
}: {
  imageUrl: string;
  imageTitle: string;
  percentage?: number;
}) {
  return (
    <div className='flex flex-col items-center justify-center w-full sm:max-w-[300px] 2xl:max-w-[500px]'>
      <div
        className={`bg-transparent border-[#dbb88b] w-full relative sm:max-w-[300px] 2xl:max-w-[500px] aspect-[5/3] max-sm:max-h-[250px] rounded-xl animate-blink`}
      >
        <Image
          src={imageUrl}
          alt={imageTitle || 'Image'}
          width={1920}
          height={1020}
          className='w-full h-full object-contain object-center'
        />
        {percentage && (
          <p
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, #343149 20.33%, rgba(0, 0, 0, 0.00) 99.48%)',
            }}
            className='p-4 lg:p-8 font-poppins text-[#dbb88b] text-base lg:text-xl font-bold absolute z-10 left-1/2 -translate-x-1/2 bottom-2'
          >
            {Number.isInteger(percentage)
              ? percentage.toLocaleString()
              : percentage.toPrecision(6).toLocaleString()}
            %
          </p>
        )}
      </div>
      <p className='p-2 lg:p-4 font-poppins text-white break-all text-sm lg:text-base font-bold'>
        {imageTitle}
      </p>
    </div>
  );
}
