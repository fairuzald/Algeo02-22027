import React from 'react';
import ImageResult from '@/components/image-result';
import Pagination from '@/components/pagination';

interface GroupPaginationProps {
  files: File[];
  imageUrls: string[];
  itemsPerPage: number;
  percentages?: number[];
}

const GroupPagination: React.FC<GroupPaginationProps> = ({
  files,
  imageUrls,
  percentages,
  itemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  // Calculate the index of the first and last item on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  console.log(percentages);

  // Get the files and image URLs for the current page
  const currentImage = imageUrls.slice(startIndex, endIndex);

  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-wrap gap-5 lg:gap-6 items-center justify-center w-full min-h-[300]'>
        {files.map((file, index) => {
          const imageUrl = imageUrls[index];
          const percentage = percentages && percentages[index];
          if (currentImage.includes(imageUrl)) {
            return (
              <ImageResult
                key={file?.name || index}
                imageUrl={imageUrl}
                imageTitle={file?.name}
                percentage={percentage}
              />
            );
          }
        })}
      </div>
      <Pagination
        numberPage={Math.ceil(files.length / itemsPerPage)}
        currentNumberPage={currentPage}
        setCurrentNumberPage={setCurrentPage}
      />
    </div>
  );
};

export default GroupPagination;
