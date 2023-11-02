'use client';
import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import Image from 'next/image';
import { type } from 'os';
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  DragEvent,
} from 'react';
interface SingleFileUploadProps {
  setFileChange: React.Dispatch<React.SetStateAction<File | null>>;
  type: 'camera' | 'file' | 'scrapping';
}
const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  setFileChange,
  type,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    // Check if there is an image URL in the localStorage
    const storedImageUrl = localStorage.getItem('imageUrl');
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
    }
    const storedFile = localStorage.getItem('fileData');
    if (storedFile) {
      setFile(JSON.parse(storedFile));
    }
  }, []);

  useEffect(() => {
    // Create a Data URL for the selected file and set it as the image URL
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
        localStorage.setItem('imageUrl', base64String);
        localStorage.setItem('fileData', JSON.stringify(file));
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (file) {
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   const response = await fetch('/api/uploadfile/', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   const data = await response.json();
    //   console.log(data);
    // }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Call the callback function with the selected file
      setFileChange(selectedFile);
    } else {
      // Call the callback function with null if no file is selected
      setFileChange(null);
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
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setImageUrl(null);
    localStorage.removeItem('imageUrl');
  };
  const links = {
    file: {
      href: '/camera',
      text: 'Use Camera',
      altHref: '/scrapping',
      altText: 'Use Scrapping',
    },
    camera: {
      href: '/file',
      text: 'Use File',
      altHref: '/scrapping',
      altText: 'Use Scrapping',
    },
    scrapping: {
      href: '/file',
      text: 'Use File',
      altHref: '/camera',
      altText: 'Use Camera',
    },
  };

  const defaultType = 'file';

  const link = links[type] || links[defaultType];

  return (
    <form onSubmit={handleSubmit}>
      <section className='flex flex-col lg:flex-row gap-10 items-center lg:items-stretch justify-center'>
        {imageUrl && file ? (
          <div className='rounded-xl overflow-hidden'>
            <Image
              src={imageUrl}
              alt={file.name ? file.name : 'Image Query'}
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
          <div className='flex flex-col gap-2 lg:gap-4'>
            <h2 className='font-poppins text-gold font-semibold text-lg lg:text-2xl'>
              Image Input
            </h2>
            <div className='space-y-3'>
              <p className='text-white font-poppins text-lg'>{file?.name}</p>
              <div className='flex gap-4'>
                <Button onClick={handleClick} size='medium' color='gradient-bp'>
                  Insert {file ? 'a New ' : 'an'} Image
                </Button>
                {file && (
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
          <p className='font-poppins text-lg lg:text-2xl text-gold font-semibold'>
            Input Option
          </p>
          <div className='flex flex-col gap-3 lg:gap-4'>
            <CustomLink color='gradient-bp' href={link.href} size='medium'>
              {link.text}
            </CustomLink>
            <CustomLink color='gradient-bp' href={link.altHref} size='medium'>
              {link.altText}
            </CustomLink>
          </div>
        </div>
      </section>
    </form>
  );
};

export default SingleFileUpload;
