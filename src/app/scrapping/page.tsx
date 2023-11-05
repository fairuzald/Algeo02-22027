'use client';

import SingleFileUpload from '@/components/single-file-upload';
import Switch from '@/components/switch';
import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/button';

import { useSearchParams } from 'next/navigation';
import Camera from '@/components/camera';
import TextInput from '@/components/text-input';
import GroupPagination, { ImageData } from '@/components/scrape-pagination';
import { Scrapper } from '@/components/scrapper';
import { makeApiRequest } from '@/lib/helper';

export default function Home() {
  // Initialize state variables for image query, image data, texture option, specific limits, and limits count
  const [imageQuery, setImageQuery] = useState<File | null>(null);
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const [imageMatrixQuery, setImageMatrixQuery] = useState<number[][]>([]);
  const [imageQueryCam, setImageQueryCam] = useState<string>('');
  const [imageDataSet, setImageDataSet] = useState<ImageData[]>([]);
  const [imageDataSetMatrix, setImageDataSetMatrix] = useState<number[][][]>(
    []
  );

  // Get the search parameters from the URL
  const searchParams = useSearchParams();
  // Determine if the camera option is selected based on the search parameters
  const isCamera = searchParams.get('camera') === 'true';

  const memoizedImageMatrixDataSet = useMemo(() => {
    return imageDataSetMatrix;
  }, [imageDataSetMatrix]);

  const memoizedImageMatrixQuery = useMemo(() => {
    return imageMatrixQuery;
  }, [imageMatrixQuery]);

  useEffect(() => {
    console.log(
      'Panjang array matrix dataset',
      memoizedImageMatrixDataSet.length
    );
    console.log('Array dataset', memoizedImageMatrixDataSet);
    console.log('Isi Query', memoizedImageMatrixQuery);
  }, [memoizedImageMatrixDataSet, memoizedImageMatrixQuery]);
  const handleDownloadPDF = async () => {
    try {
      if (imageQuery && imageDataSet && imageDataSet.length > 0) {
        // Convert the image query to a base64 string
        const imageQueryBase64 = await toBase64(imageQuery);

        // Convert the image URLs in the data set to base64 strings
        const imageDataSetBase64 = await Promise.all(
          imageDataSet.map(async (imageData) => {
            // Fetch the image from the server-side and convert it to base64
            const response = await fetch('/api/convert-image-to-base64', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url: imageData.url }),
            });
            const data = await response.json();
            return data.base64;
          })
        );

        const data = {
          image_query: imageQueryBase64,
          image_data_set: imageDataSetBase64,
        };

        makeApiRequest({
          body: JSON.stringify(data),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          loadingMessage: 'Creating PDF...',
          successMessage: 'PDF created successfully!',
          endpoint: '/api/create-pdf-file',
          onSuccess: (data) => {
            // Download the PDF file
            const pdfFilePath = data.file_path;
            const link = document.createElement('a');
            link.href = pdfFilePath;
            link.download = 'output.pdf';
            link.click();
          },
        });
      }
    } catch (error) {
      console.error(error);
      // Handle the error as needed (e.g., show an error message to the user).
    }
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <main className='flex gap-8 text-white lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-3xl lg:text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>
      <section>
        {/* Display camera component if isCamera is true, otherwise display single file upload component */}
        {isCamera ? (
          <Camera
            imageData={imageQueryCam}
            setImageData={setImageQueryCam}
            imageMatrix={imageMatrixQuery}
            setImageMatrix={setImageMatrixQuery}
          ></Camera>
        ) : (
          <SingleFileUpload
            fileChange={imageQuery}
            setFileChange={setImageQuery}
            setImageMatrix={setImageMatrixQuery}
          />
        )}
      </section>
      <hr className='border-1 border-slate-300 w-full' />

      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
          Data set input
        </h2>
        <Scrapper
          setImageData={setImageDataSet}
          imageData={imageDataSet}
          setImageDataMatrix={setImageDataSetMatrix}
          imageDataMatrix={imageDataSetMatrix}
        />
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
            onClick={handleDownloadPDF}
            disabled={!imageQuery || !imageDataSet || imageDataSet.length <= 0}
          >
            Start Processing
          </Button>
        </div>
      </section>
    </main>
  );
}
