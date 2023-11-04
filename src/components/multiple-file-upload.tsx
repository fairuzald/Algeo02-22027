// Importing the necessary libraries and components
import React, {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  DragEvent,
} from 'react';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import GroupPagination from '@/components/group-pagination';
import Button from '@/components/button';
import { IMAGE_FORMAT } from '@/types/image-format';

import { toast } from 'react-hot-toast';

// Extending the InputHTMLAttributes interface to add directory and webkitdirectory properties
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

// Interface for the component props
interface MultipleFileUploadProps {
  setFileChange: React.Dispatch<React.SetStateAction<File[] | []>>;
  setMatrixImages: React.Dispatch<React.SetStateAction<number[][][]>>;
}

// The MultipleFileUpload component
const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  setFileChange,
  setMatrixImages,
}) => {
  // State variables for managing the files, image URLs, and matrix images
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const itemsPerPage = 6;
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // useEffect hook to create Data URLs for the selected files
  useEffect(() => {
    if (files.length > 0) {
      const newImageUrls = files.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
      });

      Promise.all(newImageUrls).then((results) => {
        setImageUrls(results);
      });
    }
  }, [files]);

  // Function to handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter((file) =>
      IMAGE_FORMAT.includes(file.type)
    );

    if (imageFiles.length > 0) {
      setFiles(imageFiles);
      setFileChange(imageFiles);

      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('file', file);
      });

      // Use toast.promise to show loading, success, and error messages
      await toast.promise(
        // The promise to be tracked
        fetch('/api/convert-multiple', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.matrices) {
              setMatrixImages(data.matrices);
            }
          }),
        // Object containing messages for different promise states
        {
          loading: 'Image processing....',
          success: 'Image processing successful!',
          error: 'Image processing failed!',
        }
      );
    } else {
      toast.error('Upload folder dengan ekstensi file png, jpg, atau jpeg');
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

    if (imageFiles && imageFiles.length > 0) {
      setFiles(imageFiles);
    } else {
      toast.error('Upload folder dengan ekstensi file png, jpg, atau jpeg');
    }
  };

  // Function to handle the delete event on the delete button
  const handleDelete = () => {
    setFiles([]);
    setImageUrls([]);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = '';
    }
  };

  // Render the component
  return (
    <div>
      <section className='flex flex-col gap-7 items-center justify-center'>
        {imageUrls.length > 0 && files.length > 0 ? (
          <GroupPagination
            files={files}
            imageUrls={imageUrls}
            itemsPerPage={itemsPerPage}
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
                Insert {files.length > 0 ? 'New ' : 'the'} Images
              </Button>
              {files.length > 0 && (
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
