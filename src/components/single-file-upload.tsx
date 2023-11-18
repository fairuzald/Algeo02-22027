// Importing the necessary libraries and components
import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import { makeApiRequest } from '@/lib/helper';
import { IMAGE_FORMAT } from '@/types/image-format';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState, ChangeEvent, useRef, DragEvent } from 'react';
import { toast } from 'react-hot-toast';

// Interface for the component props
interface SingleFileUploadProps {
  setImageBase64: React.Dispatch<React.SetStateAction<string>>;
  imageBase64: string;
  type?: 'yolo' | 'normal';
}

// The SingleFileUpload component
const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  imageBase64,
  setImageBase64,
  type = 'yolo',
}) => {
  // State variables for managing the fileChange and image URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const pathname = usePathname();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && IMAGE_FORMAT.includes(selectedFile.type)) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Make API request hadnling
      makeApiRequest({
        body: formData,
        method: 'POST',
        loadingMessage: 'File image processing...',
        successMessage: 'File image processing successful!',
        endpoint: type == 'yolo' ? '/api/convert' : '/api/convert-no-yolo',
        onSuccess: (data) => {
          setImageFile(selectedFile);

          if (data.base64) {
            setImageBase64(data.base64);
          }
        },
      });
    } else {
      toast.error(
        'Upload folder dengan ekstensi file png, jpg,webp, giff,bmp,tiff atau jpeg'
      );
      setImageFile(null);
    }
  };

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && IMAGE_FORMAT.includes(droppedFile.type)) {
      setImageFile(droppedFile);
    } else {
      toast.error('Upload file dengan ekstensi png, jpg, atau jpeg');
    }
  };

  const handleDelete = () => {
    setImageFile(null);
    setImageBase64('');
  };
  // Render the component
  return (
    <div>
      <div className='flex flex-col lg:flex-row gap-10 items-center lg:items-stretch justify-center'>
        {imageBase64 && imageFile ? (
          <div className='rounded-xl overflow-hidden'>
            <Image
              src={imageBase64}
              alt={imageFile.name ? imageFile.name : 'Image Query'}
              width={550}
              height={500}
              className='h-[250px] lg:h-[340px] w-full lg:w-[550px] object-contain rounded-xl'
            />
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className='w-[550px] max-w-full px-4 py-8 lg:py-12 flex flex-col justify-center items-center rounded-lg border-dashed border-[3px] border-gold text-[#e6e6e6] space-y-4'
          >
            <button onClick={handleClick} type='button'>
              <FileUploadEmpty
                width={214}
                height={214}
                className='w-[170px] lg:w-[214px]'
              />
            </button>
            <p className='text-[15px] lg:text-base font-poppins font-bold cursor-pointer'>
              Drag atau <span className='text-blue-500'>upload</span> file kamu
              di sini
            </p>
          </div>
        )}
        <div className='flex flex-col gap-4 lg:gap-6'>
          <div className='flex flex-col gap-2 max-lg:items-center lg:gap-4'>
            <h2 className='font-poppins text-gold font-semibold  text-lg lg:text-2xl'>
              Image Input
            </h2>
            <div className='space-y-3'>
              <p className='text-white font-poppins text-lg'>
                {imageFile?.name}
              </p>
              <div className='flex gap-4'>
                <Button onClick={handleClick} size='medium' color='gradient-bp'>
                  Insert {imageFile ? 'a New ' : 'an'} Image
                </Button>
                {imageFile && (
                  <Button
                    onClick={handleDelete}
                    size='medium'
                    color='gradient-bp'
                  >
                    Delete Image
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={hiddenFileInput}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />
          </div>
          <p className='font-poppins text-lg lg:text-2xl text-gold font-semibold '>
            Other Input Query Option
          </p>

          <CustomLink
            color='gradient-bp'
            href={pathname + '?camera=true'}
            size='medium'
          >
            Camera
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default SingleFileUpload;
