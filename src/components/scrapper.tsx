import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import GroupPagination, {
  type ImageData as ImageDataType,
} from '@/components/scrape-pagination';
import Switch from '@/components/switch';
import TextInput from '@/components/text-input';
import { makeApiRequest } from '@/lib/helper';
import React, { useState } from 'react';

interface ScrapperProps {
  imageData: ImageDataType[];
  setImageData: React.Dispatch<React.SetStateAction<ImageDataType[]>>;
  imageDataMatrix: number[][][][];
  setImageDataMatrix: React.Dispatch<React.SetStateAction<number[][][][]>>;
}
interface ImageDataWithMatrix extends ImageDataType {
  matrix: number[][][];
}

export const Scrapper: React.FC<ScrapperProps> = ({
  imageData,
  imageDataMatrix,
  setImageData,
  setImageDataMatrix,
}) => {
  const [isSpecificLimits, setIsSpecificLimits] = useState<boolean>(false);
  const [limits, setLimits] = useState<number>(1);
  const [link, setLink] = useState<string>('');

  const handleGetData = async () => {
    makeApiRequest({
      method: 'GET',
      loadingMessage: 'Get data set scrapping...',
      successMessage: 'Get data set scrapping successful!',
      endpoint: `/api/scrape?url=${encodeURIComponent(link)}&limits=${
        isSpecificLimits ? limits : 0
      }`,
      onSuccess: (data: ImageDataWithMatrix[]) => {
        const nonMatrixData = data.map(({ matrix, ...rest }) => rest);
        const matrixData = data.map(({ matrix }) => matrix);
        setImageData(nonMatrixData as ImageDataType[]);
        setImageDataMatrix(matrixData);
      },
    });
  };

  return (
    <>
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
              setImageDataMatrix([]);
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
    </>
  );
};
