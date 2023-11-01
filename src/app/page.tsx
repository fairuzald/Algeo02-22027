import SingleFileUpload from '@/components/SingleFileUpload';
import ImageResult from '@/components/image-result';
import MultipleFileUpload from '@/components/multiple-file-upload';
import Switch from '@/components/switch';

export default function Home() {
  return (
    <main className='flex gap-4 lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <h1 className='font-poppins font-bold text-4xl tracking-wide text-center'>
        Reverse Image Search
      </h1>

      <SingleFileUpload />
      <hr className='border-1 border-slate-300 w-full' />

      <section className='flex flex-col gap-4'>
        <h2 className='font-poppins text-2xl flex font-semibold'>
          Data set input
        </h2>
        <MultipleFileUpload />
      </section>
      <hr className='border-1 border-slate-300 w-full' />
      <section className='flex justify-between w-full gap-4'>
        <h2 className='font-poppins text-2xl flex font-semibold'>
          CBIR Processing
        </h2>
        <div className='flex  gap-10 items-center '>
          <Switch></Switch>
          <button className='text-base rounded-full font-semibold font-poppins text-center py-2 px-8 bg-gradient-to-r from-[#1363D9] to-[#7939d4]'>
            Start
          </button>
        </div>
      </section>
    </main>
  );
}
