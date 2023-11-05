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

export default function Home() {
  const [imageQuery, setImageQuery] = useState<File | null>(null);
  const [imageMatrixQuery, setImageMatrixQuery] = useState<number[][]>([]);
  const [imageDataSet, setImageDataSet] = useState<File[]>([]);
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const [imageMatrixDataSet, setImageMatrixDataSet] = useState<number[][][]>(
    []
  );
  const [imageQueryCam, setImageQueryCam] = useState<string>('');
  const searchParams = useSearchParams();
  const isCamera = searchParams.get('camera') === 'true';

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

  const handleDownloadPDF = async () => {
    if (imageQuery && imageDataSet && imageDataSet.length > 0) {
      const imageQueryBase64 = await toBase64(imageQuery);
      const imageDataSetBase64 = await Promise.all(
        imageDataSet.map((image) => toBase64(image))
      );

      const data = {
        image_query: isCamera ? imageQueryCam : imageQueryBase64,
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
        <MultipleFileUpload
          setFilesChange={setImageDataSet}
          filesChange={imageDataSet}
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
