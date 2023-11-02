'use client';
import React from 'react';

const Pagination = ({
  numberPage,
  currentNumberPage,
  setCurrentNumberPage,
}: {
  numberPage: number;
  currentNumberPage: number;
  setCurrentNumberPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const numbers = Array.from({ length: numberPage }, (_, index) => index + 1);

  // Tentukan batas awal dan akhir untuk menampilkan halaman
  const startPage = Math.max(1, currentNumberPage - 1);
  const endPage = Math.min(numberPage, currentNumberPage + 1);

  return (
    <div className='flex gap-5'>
      {/* Tampilkan ellipsis di awal jika currentNumberPage > 3 */}
      {startPage > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(1);
            }}
            className='flex items-center justify-center sm:w-10 sm:h-10 w-7 h-7 lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            <p className='text-white uppercase text-xl lg:text-2xl'>1</p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(currentNumberPage - 1);
            }}
            className='flex items-center justify-center sm:w-10 sm:h-10 w-7 h-7 lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            <p className='text-white uppercase text-xl lg:text-2xl'>...</p>
          </button>
        </>
      )}
      {numberPage > 1 &&
        numbers.slice(startPage - 1, endPage).map((number: number) => (
          <button
            key={number}
            type='button'
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(number);
            }}
            aria-label={`Page-${number}`}
            className={`sm:w-10 sm:h-10 w-7 h-7 lg:w-[60px] hover:scale-105 ${
              currentNumberPage === number && 'drop-shadow-none'
            } lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr flex items-center justify-center from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]
          `}
          >
            <p className='text-white uppercase text-xl lg:text-2xl'>{number}</p>
          </button>
        ))}

      {/* Tampilkan ellipsis di akhir jika endPage < numberPage */}
      {endPage < numberPage && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(currentNumberPage + 1);
            }}
            className='flex items-center justify-center sm:w-10 sm:h-10 w-7 h-7 lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            <p className='text-white uppercase text-xl lg:text-2xl'>...</p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(1);
            }}
            className='flex items-center text-xl lg:text-2xl justify-center sm:w-10 sm:h-10 w-7 h-7 lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            {numberPage}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
