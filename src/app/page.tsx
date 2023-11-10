'use client';
import SingleFileUpload from '@/components/single-file-upload';
import MultipleFileUpload from '@/components/multiple-file-upload';
import Switch from '@/components/switch';
import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/button';

import { useSearchParams } from 'next/navigation';
import Camera from '@/components/camera';
import CustomLink from '@/components/custom-link';
import { makeApiRequest } from '@/lib/helper';
import TextInput from '@/components/text-input';

export default function Home() {
  // Image Query Data
  const [imageQuery, setImageQuery] = useState<string>('');
  const [imageMatrixQuery, setImageMatrixQuery] = useState<number[][]>([]);
  const [imageQueryCam, setImageQueryCam] = useState<string>('');

  // Image Data Set
  const [imageDataSet, setImageDataSet] = useState<string[]>([]);
  const [imageMatrixDataSet, setImageMatrixDataSet] = useState<number[][][]>(
    []
  );

  // Result Percentage
  const [resultPercentages, setResultPercentages] = useState<number[]>(
    imageDataSet.map((_, index) => (index + 1) * 10)
  );

  // Feature State
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const isCamera = searchParams.get('camera') === 'true';
  const [outputFileName, setOutputFileName] = useState<string>('');

  const memoizedImageMatrixDataSet = useMemo(() => {
    return imageMatrixDataSet;
  }, [imageMatrixDataSet]);

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

  useEffect(() => {
    setResultPercentages(imageDataSet.map((_, index) => (index + 1) * 10));
  }, [imageDataSet]);

  const handleDownloadPDF = async () => {
    if (
      (imageQuery || imageQueryCam) &&
      imageDataSet &&
      imageDataSet.length > 0
    ) {
      const data = {
        image_query: isCamera ? imageQueryCam : imageQuery,
        image_data_set: imageDataSet,
        is_texture: isTexture,
        result_percentage_set: resultPercentages,
        output_filename: outputFileName,
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
          link.download = `${outputFileName}.pdf`;
          link.click();
        },
      });
    }
  };

  return (
    <main className='flex gap-8 text-white lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-3xl lg:text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>
      <section>
        {isCamera ? (
          <Camera
            imageData={imageQueryCam}
            setImageData={setImageQueryCam}
            imageMatrix={imageMatrixQuery}
            setImageMatrix={setImageMatrixQuery}
          ></Camera>
        ) : (
          <SingleFileUpload
            imageBase64={imageQuery}
            setImageBase64={setImageQuery}
            setImageMatrix={setImageMatrixQuery}
          />
        )}
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
          Data set input
        </h2>
        <MultipleFileUpload
          setImageBase64s={setImageDataSet}
          imageBase64s={imageDataSet}
          setMatrixImages={setImageMatrixDataSet}
        />
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
            disabled={!imageQuery || !imageDataSet || imageDataSet.length <= 0}
          >
            Start Processing
          </Button>
        </div>
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex max-md:flex-col  w-full gap-4'>
        <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold '>
          Output File:
        </h2>
        <div className='flex justify-center max-lg:flex-col flex-wrap flex-1 max-lg:w-full  max-sm  gap-5 lg:gap-10'>
          <TextInput
            input={outputFileName}
            setInput={setOutputFileName}
            placeHolder='Masukkan nama file output'
            type='text'
          />
          <Button
            color='gradient-bp'
            size='small'
            isRounded
            onClick={handleDownloadPDF}
            disabled={
              (!imageQuery && !imageQueryCam) ||
              !imageDataSet ||
              imageDataSet.length <= 0 ||
              !outputFileName
            }
          >
            Download Report
          </Button>
        </div>
      </section>
    </main>
  );
}
