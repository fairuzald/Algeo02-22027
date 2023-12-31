// Importing the necessary libraries and components
import React, { useState, ChangeEvent, useRef, DragEvent } from 'react';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import GroupPagination from '@/components/group-pagination';
import Button from '@/components/button';
import { IMAGE_FORMAT } from '@/types/image-format';

import { toast } from 'react-hot-toast';
import { makeApiRequest } from '@/lib/helper';

// Extending the InputHTMLAttributes interface to add directory and webkitdirectory properties
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

// Interface for the component props
interface MultipleFileUploadProps {
  setImageBase64s: React.Dispatch<React.SetStateAction<string[]>>;
  imageBase64s: string[];
  percentages: number[];
  setPercentages: React.Dispatch<React.SetStateAction<number[]>>;
}

// The MultipleFileUpload component
const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  setImageBase64s,
  imageBase64s,
  percentages,
  setPercentages,
}) => {
  // State variables for managing the filesChange, image URLs, and matrix images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const itemsPerPage = 6;
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // Function to handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter((file) =>
      IMAGE_FORMAT.includes(file.type)
    );

    // Pecah data menjadi batch
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Kirim setiap batch
    for (const batch of batches) {
      const formData = new FormData();
      batch.forEach((file) => {
        formData.append('files', file);
      });

      // Shoot api
      makeApiRequest({
        body: formData,
        method: 'POST',
        loadingMessage: 'Data set processing...',
        successMessage: 'Data set processing successful!',
        endpoint: '/api/convert-multiple',
        onSuccess: (data) => {
          // Dapatkan nilai sebelumnya
          const prevImageBase64s = [...imageBase64s];

          if (data.base64_images) {
            setImageBase64s((prevImageBase64s) => [
              ...prevImageBase64s,
              ...data.base64_images,
            ]);
          }

          // Tambahkan data batch ke state setImageFiles
          setImageFiles((prevFiles) => [...prevFiles, ...batch]);
        },
      });
    }
  };

  // Function to handle the click event on the file upload button
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  // Function to handle the drag over event on the dropzone
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Function to handle the file drop event on the dropzone
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const items = Array.from(e.dataTransfer.items || []);
    const files = await Promise.all(
      items.map(async (item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          return file;
        }
      })
    );

    const imageFiles = files.filter(
      (file): file is File => file != null && IMAGE_FORMAT.includes(file.type)
    );

    if (imageFiles.length > 0) {
      setImageFiles((prevFiles) => [...prevFiles, ...imageFiles]);
      // Process each dropped file
      for (const droppedFile of imageFiles) {
        const formData = new FormData();
        formData.append('files', droppedFile);

        // Shoot API for each dropped file
        makeApiRequest({
          body: formData,
          method: 'POST',
          loadingMessage: 'File image processing...',
          successMessage: 'File image processing successful!',
          endpoint: '/api/convert-multiple',
          onSuccess: (data) => {
            // Dapatkan nilai sebelumnya
            const prevImageBase64s = [...imageBase64s];

            if (data.base64_images) {
              setImageBase64s((prevImageBase64s) => [
                ...prevImageBase64s,
                ...data.base64_images,
              ]);
            }
          },
        });
      }
    } else {
      toast.error(
        'Upload folder dengan ekstensi file png, jpg,webp, giff,bmp,tiff atau jpeg'
      );
    }
  };

  // Function to handle the delete event on the delete button
  const handleDelete = () => {
    setImageFiles([]);
    setImageBase64s([]);
    setPercentages([]);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = '';
    }
  };

  // Render the component
  return (
    <div>
      <section className='flex flex-col gap-7 items-center justify-center'>
        {imageBase64s.length > 0 && imageFiles.length > 0 ? (
          <GroupPagination
            files={imageFiles}
            imageUrls={imageBase64s}
            itemsPerPage={itemsPerPage}
            percentages={percentages}
          />
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className='w-[550px] max-w-full px-4 py-8 lg:py-12 flex flex-col justify-center items-center rounded-lg border-dashed border-[3px] border-[#dbb88b] text-[#e6e6e6] space-y-4'
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

        <div className='flex items-center flex-col gap-3 lg:gap-6'>
          <div className='space-y-3'>
            <div className='flex gap-4'>
              <Button onClick={handleClick} size='medium' color='gradient-bp'>
                Insert {imageFiles.length > 0 ? 'New ' : 'the'} Images
              </Button>
              {imageFiles.length > 0 && (
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
            webkitdirectory=''
            type='file'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>
      </section>
    </div>
  );
};

export default MultipleFileUpload;
