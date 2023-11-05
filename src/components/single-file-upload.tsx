// Importing the necessary libraries and components
import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import { makeApiRequest } from '@/lib/helper';
import { IMAGE_FORMAT } from '@/types/image-format';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  DragEvent,
} from 'react';
import { toast } from 'react-hot-toast';

// Interface for the component props
interface SingleFileUploadProps {
  setFileChange: React.Dispatch<React.SetStateAction<File | null>>;
  fileChange: File | null;
  setImageMatrix: React.Dispatch<React.SetStateAction<number[][]>>;
}

// The SingleFileUpload component
const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  fileChange,
  setFileChange,
  setImageMatrix,
}) => {
  // State variables for managing the fileChange and image URL
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Jika fileChange ada dan fileChange merupakan instance dari File
    if (fileChange && fileChange instanceof File) {
      // Membuat URL Object dari fileChange dan set sebagai image URL
      const url = URL.createObjectURL(fileChange);
      setImageUrl(url);

      // Membersihkan URL Object ketika komponen unmount atau fileChange berubah
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fileChange]);

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
        endpoint: '/api/convert',
        onSuccess: (data) => {
          if (data.matrix) {
            setImageMatrix(data.matrix);
            setFileChange(selectedFile);
          }
        },
      });
    } else {
      toast.error('Upload file dengan ekstensi png atau jpeg');
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
    if (droppedFile && IMAGE_FORMAT.includes(droppedFile.type)) {
      setFileChange(droppedFile);
    } else {
      toast.error('Upload file dengan ekstensi png, jpg, atau jpeg');
    }
  };

  const handleDelete = () => {
    setFileChange(null);
    setImageUrl(null);
    setImageMatrix([]);
  };
  // Render the component
  return (
    <div>
      <div className='flex flex-col lg:flex-row gap-10 items-center lg:items-stretch justify-center'>
        {imageUrl && fileChange ? (
          <div className='rounded-xl overflow-hidden'>
            <Image
              src={imageUrl}
              alt={fileChange.name ? fileChange.name : 'Image Query'}
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
                {fileChange?.name}
              </p>
              <div className='flex gap-4'>
                <Button onClick={handleClick} size='medium' color='gradient-bp'>
                  Insert {fileChange ? 'a New ' : 'an'} Image
                </Button>
                {fileChange && (
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
