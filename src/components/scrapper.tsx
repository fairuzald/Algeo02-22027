'use client';
// Import necessary components and libraries
import React, { useState } from 'react';
import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import GroupPagination, {
  type ImageData as ImageDataType,
} from '@/components/scrape-pagination';
import Switch from '@/components/switch';
import TextInput from '@/components/text-input';
import { makeApiRequest } from '@/lib/helper';

// Define the ScrapperProps interface
interface ScrapperProps {
  imageData: ImageDataType[];
  setImageData: React.Dispatch<React.SetStateAction<ImageDataType[]>>;
  percentages?: number[];
  setPercentages: React.Dispatch<React.SetStateAction<number[]>>;
}

// Define the Scrapper component
export const Scrapper: React.FC<ScrapperProps> = ({
  imageData,
  setImageData,
  percentages,
  setPercentages,
}) => {
  // State variables for specific limits, limits, and link
  const [isSpecificLimits, setIsSpecificLimits] = useState<boolean>(false);
  const [limits, setLimits] = useState<number>(1);
  const [link, setLink] = useState<string>('');
  const [outputFileName, setOutputFileName] = useState<string>('');
  // Function to handle getting data from the API
  const handleGetData = async () => {
    makeApiRequest({
      method: 'GET',
      loadingMessage: 'Get data set scrapping...',
      successMessage: 'Get data set scrapping successful!',
      endpoint: `/api/scrape?url=${encodeURIComponent(link)}&limits=${
        isSpecificLimits ? limits : 0
      }`,
      onSuccess: (data: ImageDataType[]) => {
        setImageData(data);
      },
    });
  };

  // Function to handle downloading images from the API
  const handleDownloadImage = () => {
    if (imageData.length > 0) {
      // Make API request to download images
      makeApiRequest({
        method: 'POST',
        body: JSON.stringify({ data: imageData }),
        loadingMessage: 'Download image...',
        successMessage: 'Download image successful!',
        endpoint: `/api/download_all_images?output_file_name=${encodeURIComponent(
          outputFileName
        )}`,
        onSuccess: (data) => {},
      });
    }
  };

  // Return the JSX for the Scrapper component
  return (
    <>
      {/* Display image data pagination component if there is image data, otherwise display data input form */}
      {imageData.length > 0 ? (
        <GroupPagination
          imageUrls={imageData}
          itemsPerPage={6}
          percentages={percentages}
        />
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
              disabled={!link || (limits === 0 && isSpecificLimits)}
              onClick={handleGetData}
            >
              Get the data
            </Button>
            {/* Button to trigger handleDownloadImage function */}
          </div>
        </div>
      )}
      {/* Display button to clear image data if there is image data */}
      {imageData.length > 0 && (
        <div className='flex flex-col gap-2'>
          <TextInput
            input={outputFileName}
            setInput={setOutputFileName}
            placeHolder='Masukkan nama folder output'
            type='text'
          />
          <div className=' my-2 flex gap-4 items-center justify-center'>
            <Button
              size='medium'
              color='gradient-bp'
              onClick={() => {
                setImageData([]);
                setPercentages([]);
                setLink('');
              }}
            >
              Delete all data
            </Button>
            <Button
              color='gradient-bp'
              size='medium'
              disabled={imageData.length === 0 || outputFileName === ''}
              onClick={handleDownloadImage}
            >
              Download Images
            </Button>
          </div>
        </div>
      )}
      {/* Display other input query options */}
      <div className='flex items-center flex-wrap justify-center gap-4 py-4'>
        <p className='text-lg lg:text-2xl font-poppins font-semibold text-gold'>
          Other Input Query Option:
        </p>
        <CustomLink color='gradient-bp' href='/cbir' size='medium'>
          Files Upload
        </CustomLink>
      </div>
    </>
  );
};
