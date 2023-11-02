'use client';
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  DragEvent,
} from 'react';
import FileUploadEmpty from '@/components/icons/file-upload-empty-icon';
import GroupPagination from '@/components/group-pagination';
import Button from '@/components/button';
interface MultipleFileUploadProps {
  setFileChange: React.Dispatch<React.SetStateAction<File[] | []>>;
}
const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  setFileChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Create Data URLs for the selected files and set them as the image URLs
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (files.length > 0) {
    //   const formData = new FormData();
    //   files.forEach((file) => {
    //     formData.append('files', file);
    //   });

    //   const response = await fetch('/api/uploadfile/', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   const data = await response.json();
    //   console.log(data);
    // }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setFileChange(selectedFiles);
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
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  const handleDelete = () => {
    setFiles([]);
    setImageUrls([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='flex flex-col gap-7 items-center justify-center'>
        {imageUrls.length > 0 && files.length > 0 ? (
          <GroupPagination
            files={files}
            imageUrls={imageUrls}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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

        <div className='flex flex-col gap-3 lg:gap-6'>
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
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
            className='hidden'
          />
        </div>
      </section>
    </form>
  );
};

export default MultipleFileUpload;
