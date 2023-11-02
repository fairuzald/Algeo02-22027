'use client';
import SingleFileUpload from '@/components/single-file-upload';
import ImageResult from '@/components/image-result';
import MultipleFileUpload from '@/components/multiple-file-upload';
import Switch from '@/components/switch';
import { useState } from 'react';
import Button from '@/components/button';

import { useParams, useSearchParams } from 'next/navigation';
import Camera from '@/components/camera';
import CustomLink from '@/components/custom-link';

export default function Home() {
  const [imageQuery, setImageQuery] = useState<File | null>(null);
  const [imageData, setImageData] = useState<File[]>([]);
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const isCamera = searchParams.get('camera') === 'true';

  const handleCapture = (dataUrl: string) => {
    // Mengonversi data URL ke Blob
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Mengonversi Blob ke File
        const file = new File([blob], 'Captured Image', { type: 'image/png' });
        setImageQuery(file);
      });
  };
  return (
    <main className='flex gap-8 text-white lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-3xl lg:text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>
      <section>
        {isCamera ? (
          <Camera onCapture={handleCapture}></Camera>
        ) : (
          <SingleFileUpload setFileChange={setImageQuery} type='file' />
        )}
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
          Data set input
        </h2>
        <MultipleFileUpload setFileChange={setImageData} />
        <div className='flex items-center flex-wrap justify-center gap-4 py-4'>
          <p className='text-lg lg:text-2xl font-poppins font-semibold text-gold'>
            Other Input Query Option:
          </p>
          <CustomLink color='gradient-bp' href='/scrapping' size='medium'>
            Data Scrapping
          </CustomLink>
        </div>
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex flex-col lg:flex-row justify-between items-center w-full gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold '>
          CBIR Processing
        </h2>
        <div className='flex flex-1 max-lg:w-full flex-wrap max-sm px-10 gap-5 lg:gap-10 items-center justify-around md:justify-between'>
          <Switch
            checked={isTexture}
            onChange={setIsTexture}
            optionFalse='Color'
            optionTrue='Texture'
          />
          <Button
            color='gradient-bp'
            size='small'
            isRounded
            disabled={!imageQuery || !imageData || imageData.length <= 0}
          >
            Start Processing
          </Button>
        </div>
      </section>
    </main>
  );
}
