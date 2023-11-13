import React from 'react';
import ImageResult from '@/components/image-result';
import Pagination from '@/components/pagination';

export type ImageData = {
  url: string;
  title: string;
};

interface GroupPaginationProps {
  imageUrls: ImageData[];
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

  // Create an array of objects for the filtered files
  // Create an array of objects for the filtered files
  const hasPercentages = percentages && percentages.length > 0;

  // Create an array of objects for the filtered files
  const filteredFilesData = imageUrls.map((data, index) => {
    const imageUrl = data.url;
    const percentage = hasPercentages ? percentages[index] : undefined;
    return {
      percentage: percentage && percentage > 60 ? percentage : undefined,
      imageUrl: imageUrl,
      title: data.title,
    };
  });
  // Sort the files in descending order based on percentage
  const sortedFilesData = filteredFilesData.sort((a, b) => {
    return (b.percentage || 0) - (a.percentage || 0);
  });

  // Get the files and image URLs for the current page
  const filteredFilesData2 = hasPercentages
    ? sortedFilesData.filter((data) => data.percentage !== undefined)
    : sortedFilesData;

  const currentImage = filteredFilesData2.slice(startIndex, endIndex);
  return (
    <div className='flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-wrap gap-5 lg:gap-6 items-center justify-center w-full min-h-[300]'>
        {currentImage.map((data, index) => (
          <ImageResult
            key={data.title || index}
            imageUrl={data.imageUrl}
            imageTitle={data.title}
            percentage={data.percentage}
          />
        ))}
      </div>
      <Pagination
        numberPage={Math.ceil(filteredFilesData2.length / itemsPerPage)}
        currentNumberPage={currentPage}
        setCurrentNumberPage={setCurrentPage}
      />
    </div>
  );
};

export default GroupPagination;
