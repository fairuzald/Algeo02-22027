'use client';
import ChevronIcon from '@/components/icons/chevron-icon';
import React, { useEffect } from 'react';

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
  useEffect(() => {
    if (currentNumberPage < 1) {
      setCurrentNumberPage(1);
    } else if (currentNumberPage > numberPage) {
      setCurrentNumberPage(numberPage);
    }
  }, [currentNumberPage, numberPage, setCurrentNumberPage]);

  // Tentukan batas awal dan akhir untuk menampilkan halaman
  const startPage = Math.max(
    1,
    numberPage > 7 ? currentNumberPage - 1 : currentNumberPage - 2
  );
  const endPage = Math.min(
    numberPage,
    numberPage > 7 ? currentNumberPage + 1 : currentNumberPage + 2
  );

  return (
    <div className='flex gap-5'>
      {numberPage > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setCurrentNumberPage(currentNumberPage - 1);
          }}
          className='flex items-center justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
        >
          <ChevronIcon
            size={20}
            className='w-5 sm:w-7 lg:w-[20px] aspect-square fill-white rotate-180'
          />
        </button>
      )}
      {/* Tampilkan ellipsis di awal jika currentNumberPage > 3 */}
      {startPage > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(1);
            }}
            className='flex items-center justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            <p className='text-white uppercase '>1</p>
          </button>
          {numberPage > 7 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentNumberPage(currentNumberPage - 1);
              }}
              className='flex items-center justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
            >
              <p className='text-white uppercase '>...</p>
            </button>
          )}
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
            className={`sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] hover:scale-105   drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)] ${
              currentNumberPage === number
                ? 'bg-blue-600 drop-shadow-none'
                : 'bg-gradient-to-tr from-[#733bd4] to-[#1861d9]'
            } lg:h-[60px] p-[1px] rounded-full flex items-center justify-center
          `}
          >
            <p className='text-white uppercase '>{number}</p>
          </button>
        ))}

      {/* Tampilkan ellipsis di akhir jika endPage < numberPage */}
      {endPage < numberPage && (
        <>
          {numberPage > 7 && endPage != numberPage - 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentNumberPage(currentNumberPage + 1);
              }}
              className='flex items-center justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
            >
              <p className='text-white uppercase '>...</p>
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentNumberPage(1);
            }}
            className='flex items-center  justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
          >
            {numberPage}
          </button>
        </>
      )}
      {numberPage > 1 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setCurrentNumberPage(currentNumberPage + 1);
          }}
          className='flex items-center justify-center sm:w-10 sm:h-10 w-6 h-6 text-sm md:text-base lg:text-2xl lg:w-[60px] lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]'
        >
          <ChevronIcon
            size={20}
            className='w-5 sm:w-7 lg:w-[20px] aspect-square fill-white'
          />
        </button>
      )}
    </div>
  );
};

export default Pagination;
