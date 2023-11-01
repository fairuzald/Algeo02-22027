import Camera from '@/components/camera';
import React from 'react';

export default function PageCamera() {
  return (
    <div className='flex gap-4 lg:gap-10 min-h-screen items-center justify-center flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-4xl tracking-wide text-center'>
        Camera Feature
      </h1>

      <Camera />
    </div>
  );
}
