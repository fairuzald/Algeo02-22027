'use client';
import SingleFileUpload from '@/components/single-file-upload';
import MultipleFileUpload from '@/components/multiple-file-upload';
import Switch from '@/components/switch';
import { useState } from 'react';
import Button from '@/components/button';

import { useSearchParams } from 'next/navigation';
import Camera from '@/components/camera';
import CustomLink from '@/components/custom-link';
import { makeApiRequest } from '@/lib/helper';
import TextInput from '@/components/text-input';
import toast from 'react-hot-toast';

export default function Home() {
  // Image Query Data

  const [imageQuery, setImageQuery] = useState<string>('');
  const [imageQueryCam, setImageQueryCam] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Image Data Set
  const [imageDataSet, setImageDataSet] = useState<string[]>([]);

  // Result Percentage
  const [resultPercentages, setResultPercentages] = useState<number[]>([]);

  const triggerCBIRProcessing = (imageQuery: string) => {
    // Check if the dataset is available
    if (imageQueryCam && imageDataSet.length > 0) {
      // Call the CBIR processing function
      handleCBIR();
    } else {
      // Handle the case where the dataset is not available
      toast.error('Dataset is not available for CBIR processing');
    }
    setIsLoading(false);
  };
  // Feature State
  const [isTexture, setIsTexture] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const isCamera = searchParams.get('camera') === 'true';
  const [outputFileName, setOutputFileName] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const handleDownloadPDF = async () => {
    if (
      (imageQuery || imageQueryCam) &&
      imageDataSet &&
      imageDataSet.length > 0 &&
      elapsedTime > 0
    ) {
      setIsLoading(true);

      // Create an array of indices and sort it based on resultPercentages
      const indices = resultPercentages.map((_, index) => index);
      indices.sort((a, b) => resultPercentages[b] - resultPercentages[a]);

      // Reorder imageDataSet and resultPercentages based on the sorted indices
      const sortedImageDataSet = indices.map((index) => imageDataSet[index]);
      const sortedResultPercentages = indices.map(
        (index) => resultPercentages[index]
      );

      const data = {
        image_query: isCamera ? imageQueryCam : imageQuery,
        image_data_set: sortedImageDataSet,
        is_texture: isTexture,
        result_percentage_set: sortedResultPercentages,
        output_filename: outputFileName,
        elapsed_time: elapsedTime,
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
          setIsLoading(false);
        },
      });
    }
  };
  const handleCBIR = async () => {
    if (
      imageDataSet &&
      imageDataSet.length > 0 &&
      (imageQuery || imageQueryCam)
    ) {
      setIsLoading(true);
      const data = JSON.stringify({
        base64_query: isCamera ? imageQueryCam : imageQuery,
        base64_dataset: imageDataSet,
      });
      makeApiRequest({
        body: data,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        loadingMessage: isTexture
          ? 'CBIR Texture Processing...'
          : 'CBIR Color Processing',
        successMessage: 'CBIR successful!',
        endpoint: isTexture ? '/api/cbir-texture' : '/api/cbir-color',
        onSuccess: (data) => {
          setIsLoading(false);
          setElapsedTime(data.elapsed_time);
          setResultPercentages(data.similarities);
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
            isLoadingOutside={isLoading}
            triggerCBIRProcessing={triggerCBIRProcessing}
          ></Camera>
        ) : (
          <SingleFileUpload
            imageBase64={imageQuery}
            setImageBase64={setImageQuery}
            type='yolo'
          />
        )}
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <h2 className='font-poppins text-xl lg:text-2xl flex font-semibold'>
            Data set input
          </h2>
          {elapsedTime > 0 && resultPercentages.length > 0 && (
            <div className='flex justify-between w-full'>
              <p className='font-poppins text-base lg:text-lg'>
                Total Results: {imageDataSet.length} in{' '}
                {elapsedTime.toPrecision(3)} seconds
              </p>
              <p className='font-poppins text-base lg:text-lg'>
                Results with Percentage {'>'} 60%:{' '}
                {
                  resultPercentages.filter((percentage) => percentage > 60)
                    .length
                }
              </p>
            </div>
          )}
        </div>
        <MultipleFileUpload
          setImageBase64s={setImageDataSet}
          imageBase64s={imageDataSet}
          percentages={resultPercentages}
          setPercentages={setResultPercentages}
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
            disabled={
              (!imageQuery && !imageQueryCam) ||
              !imageDataSet ||
              imageDataSet.length <= 0
            }
            onClick={handleCBIR}
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
