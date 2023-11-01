'use client';
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
  return (
    <div className='flex gap-5'>
      {numberPage > 1 &&
        numbers.map((number: number) => (
          <button
            key={number}
            type='button'
            onClick={(e) => {
              e.preventDefault;
              setCurrentNumberPage(number);
            }}
            aria-label={`Page-${number}`}
            className={`w-10 h-10 lg:w-[60px] hover:scale-105 ${
              currentNumberPage === number && 'drop-shadow-none'
            } lg:h-[60px] p-[1px] rounded-full bg-gradient-to-tr flex items-center justify-center from-[#733bd4] to-[#1861d9]  drop-shadow-[0px_0px_10px_rgba(190,1,246,0.5)]
                        `}
          >
            <p className='text-white uppercase text-2xl lg:text-3xl'>
              {number}
            </p>
          </button>
        ))}
    </div>
  );
};

export default Pagination;
