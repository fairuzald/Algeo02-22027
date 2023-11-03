import React from 'react';
import ImageResult from '@/components/image-result';
import Pagination from '@/components/pagination';

interface GroupPaginationProps {
  imageUrls: string[];
  itemsPerPage: number;
  percentages?: number[];
}

const GroupPagination: React.FC<GroupPaginationProps> = ({
  imageUrls,
  percentages,
  itemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  // Calculate the index of the first and last item on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the files and image URLs for the current page
  const currentFiles = imageUrls.slice(startIndex, endIndex);
  const currentImageUrls = imageUrls.slice(startIndex, endIndex);

  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-wrap gap-5 lg:gap-6 items-center justify-center w-full min-h-[300]'>
        {currentImageUrls.map((imageUrl, index) => (
          <ImageResult
            key={currentFiles[index]}
            imageUrl={imageUrl}
            imageTitle={currentFiles[index]}
            percentage={percentages && percentages[index]}
          />
        ))}
      </div>
      <Pagination
        numberPage={Math.ceil(imageUrls.length / itemsPerPage)}
        currentNumberPage={currentPage}
        setCurrentNumberPage={setCurrentPage}
      />
    </div>
  );
};

export default GroupPagination;
