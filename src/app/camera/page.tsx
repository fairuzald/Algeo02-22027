'use client';
import SingleFileUpload from '@/components/single-file-upload';
import ImageResult from '@/components/image-result';
import MultipleFileUpload from '@/components/multiple-file-upload';
import Switch from '@/components/switch';
import { useState } from 'react';
import Button from '@/components/button';
import Camera from '@/components/camera';
import CustomLink from '@/components/custom-link';

export default function CameraPage() {
  const [imageQuery, setImageQuery] = useState<File | null>(null);
  const [imageData, setImageData] = useState<File[]>([]);
  const [isTexture, setIsTexture] = useState<boolean>(false);
  return (
    <main className='flex gap-8 lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-3xl lg:text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>
      <section className='flex flex-col gap-4 items-center justify-center'>
        <Camera />
        <div className='flex  gap-3 lg:gap-4'>
          <CustomLink color='gradient-bp' href='/' size='medium'>
            Use File
          </CustomLink>
          <CustomLink color='gradient-bp' href='/scrapping' size='medium'>
            Use Scrapping
          </CustomLink>
        </div>
      </section>
      <hr className='border-1 border-slate-300 w-full' />

      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
          Data set input
        </h2>
        <MultipleFileUpload setFileChange={setImageData} />
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
          <Button color='gradient-bp' size='small' isRounded>
            Start Processing
          </Button>
        </div>
      </section>
    </main>
  );
}
