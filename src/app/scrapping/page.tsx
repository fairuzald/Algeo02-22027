'use client';

import SingleFileUpload from '@/components/single-file-upload';
import Switch from '@/components/switch';
import { useState } from 'react';
import Button from '@/components/button';

import { useSearchParams } from 'next/navigation';
import Camera from '@/components/camera';
import TextInput from '@/components/text-input';
import CustomLink from '@/components/custom-link';
import GroupPagination, { ImageData } from '@/components/scrape-pagination';

export default function Home() {
  // Initialize state variables for image query, image data, texture option, specific limits, and limits count
  const [imageQuery, setImageQuery] = useState<File | null>(null);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const [isSpecificLimits, setIsSpecificLimits] = useState<boolean>(false);
  const [limits, setLimits] = useState<number>(1);
  // Get the search parameters from the URL
  const searchParams = useSearchParams();
  // Determine if the camera option is selected based on the search parameters
  const isCamera = searchParams.get('camera') === 'true';

  const handleCapture = (dataUrl: string) => {
    // Convert data URL to Blob
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Convert Blob to File
        const file = new File([blob], 'Captured Image', { type: 'image/png' });
        // Set the image query state variable
        setImageQuery(file);
      });
  };

  const [link, setLink] = useState<string>('');
  const handleGetData = async () => {
    // Send a GET request to the API with the link and limits as query parameters
    if (!isSpecificLimits) {
      setLimits(0);
    }
    const response = await fetch(
      `/api/scrape?url=${encodeURIComponent(link)}&limits=${limits}`
    );
    const data = await response.json();
    // Set the image data state variable
    setImageData(data);
  };

  return (
    <main className='flex gap-8 text-white lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-3xl lg:text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>
      <section>
        {/* Display camera component if isCamera is true, otherwise display single file upload component */}
        {isCamera ? (
          <Camera onCapture={handleCapture}></Camera>
        ) : (
          <SingleFileUpload setFileChange={setImageQuery} />
        )}
      </section>
      <hr className='border-1 border-slate-300 w-full' />

      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
          Data set input
        </h2>
        {/* Display image data pagination component if there is image data, otherwise display data input form */}
        {imageData.length > 0 ? (
          <GroupPagination imageUrls={imageData} itemsPerPage={6} />
        ) : (
          <div className='flex gap-7 flex-col'>
            {/* Text input for link */}
            <TextInput
              input={link}
              setInput={setLink}
              type='text'
              placeHolder='Masukkan link web yang mau discrapping'
            />
            {/* Switch for specific limits */}
            <Switch
              checked={isSpecificLimits}
              onChange={setIsSpecificLimits}
              optionFalse='All data'
              optionTrue='Specific data count'
            />
            <div className='w-full flex gap-3 flex-wrap'>
              {/* Show number input for limits if specific limits is selected */}
              {isSpecificLimits && (
                <div className='max-w-[130px]'>
                  <TextInput
                    input={limits}
                    setInput={setLimits}
                    type='number'
                    placeHolder='Masukkan link web yang mau discrapping'
                  />
                </div>
              )}
              {/* Button to trigger handleGetData function */}
              <Button
                color='gradient-bp'
                size='small'
                isRounded
                disabled={!link || (limits == 0 && isSpecificLimits)}
                onClick={handleGetData}
              >
                Get the data
              </Button>
            </div>
          </div>
        )}
        {/* Display button to clear image data if there is image data */}
        {imageData.length > 0 && (
          <div className='mx-auto my-2'>
            <Button
              size='medium'
              color='gradient-bp'
              onClick={() => {
                setImageData([]);
              }}
            >
              Delete all data
            </Button>
          </div>
        )}
        {/* Display other input query options */}
        <div className='flex items-center flex-wrap justify-center gap-4 py-4'>
          <p className='text-lg lg:text-2xl font-poppins font-semibold text-gold'>
            Other Input Query Option:
          </p>
          <CustomLink color='gradient-bp' href='/' size='medium'>
            Files Upload
          </CustomLink>
        </div>
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      {/* Display CBIR processing section */}
      <section className='flex flex-col lg:flex-row justify-between items-center w-full gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold '>
          CBIR Processing
        </h2>
        <div className='flex flex-1 max-lg:w-full flex-wrap max-sm px-10 gap-5 lg:gap-10 items-center justify-around md:justify-between'>
          {/* Switch for texture option */}
          <Switch
            checked={isTexture}
            onChange={setIsTexture}
            optionFalse='Color'
            optionTrue='Texture'
          />
          {/* Button to start processing */}
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
