'use client';
import Button from '@/components/button';
import CustomLink from '@/components/custom-link';
import { features } from '@/const/feature';
import { howToUseSteps } from '@/const/howtouse';
import Image from 'next/image';
interface Feature {
  title: string;
  description: string;
  options?: string[];
}
interface Step {
  title: string;
  description: string;
  options?: string[];
}
interface SectionProps {
  title1: string;
  title2: string;
  items: (Feature | Step)[];
}

export default function Home() {
  // Image Query Data
  const FeatureSection: React.FC<SectionProps> = ({
    title1,
    title2,
    items,
  }) => (
    <section className='px-8 sm:px-10 md:px-20 lg:px-40 flex flex-col items-center justify-center gap-2 lg:gap-10 w-full'>
      <h2 className='font-poppins text-3xl text-gold-light font-semibold text-center'>
        {title1}
      </h2>
      <div className='container mx-auto my-8 p-8 lg:p-10 font-poppins text-base bg-[#0B2545] shadow-md rounded-xl'>
        <h3 className='text-xl lg:text-3xl font-bold mb-6 text-center'>
          {title2}
        </h3>
        <ul className='list-decimal pl-4'>
          {items.map((item, index) => (
            <li key={index} className='mb-8 text-sm lg:text-base'>
              <h4 className='font-semibold mb-4'>{item.title}</h4>
              {item.options ? (
                <ul className='list-disc pl-4 lg:pl-6 font-normal'>
                  {item.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
  return (
    <main className='flex gap-8 pb-20 text-white w-full lg:gap-10 min-h-screen flex-col bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <div className='relative h-[calc(100vh-100px)] w-full overflow-hidden'>
        <Image
          alt='Tes'
          src={'/white.jpg'}
          width={1920}
          height={1080}
          className='object-center object-cover w-full h-full'
        />
        <div className='absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6'>
          <h1 className='font-poppins text-4xl font-bold bg-gradient-to-r from-[#1363D9] to-[#7939d4] bg-clip-text text-transparent'>
            Cukurukuk
          </h1>
          <CustomLink href='/cbir' isRounded size='large' color='gradient-bp'>
            CBIR
          </CustomLink>
        </div>
      </div>
      <section className='py-20 px-8 sm:px-10 md:px-20 lg:px-40 flex flex-col items-center justify-center gap-10'>
        <h2 className='text-gold-light font-poppins text-3xl font-semibold text-center'>
          Our Video
        </h2>
        <iframe
          className='h-[250px] md:h-[300px] w-full max-w-[400px] lg:h-[20vw] lg:w-[30vw] lg:max-w-[600px] lg:max-h-[500px] video__iframe'
          src='https://www.youtube.com/embed/SLfZstRNbcU?autoplay=1'
          frameBorder='0'
          allowFullScreen
        ></iframe>
      </section>
      <section className='px-8 sm:px-10 md:px-20 lg:px-40 flex flex-col gap-10'>
        <h2 className='text-gold-light font-poppins text-3xl font-semibold text-center'>
          Konsep
        </h2>
        <div className=' flex flex-col items-center justify-center p-8 lg:p-10 font-poppins text-base bg-[#0B2545] shadow-md rounded-xl'>
          <h3 className='text-xl lg:text-3xl font-bold mb-6 text-white'>
            Content-Based Image Retrieval (CBIR)
          </h3>
          <div className='mb-8 text-white text-sm lg:text-base'>
            <p>
              Dalam Content-Based Image Retrieval (CBIR), gambar diwakili
              sebagai matriks piksel atau keabuan, kemudian diubah menjadi
              vektor-fitur untuk perbandingan. Matriks piksel atau keabuan
              diubah menjadi vektor satu dimensi dengan menggabungkan nilai
              intensitas piksel. Proses cosine similarity digunakan untuk
              membandingkan vektor-fitur gambar query dengan vektor-fitur
              dataset.{' '}
            </p>
          </div>

          <div className='mb-8 '>
            <h2 className='text-sm lg:text-xl font-semibold mb-4 text-white'>
              CBIR dengan Parameter Warna
            </h2>
            <p className='text-white text-sm lg:text-base'>
              CBIR dengan parameter warna melibatkan konversi gambar ke format
              HSV, pencarian histogram warna (global dan blok), dan penggunaan
              metode cosine similarity untuk membandingkan vektor-fitur warna
              antara gambar query dan dataset.
            </p>
          </div>

          <div className='mb-8'>
            <h2 className='text-sm lg:text-xl font-semibold mb-4 text-white'>
              CBIR dengan Parameter Tekstur
            </h2>
            <p className='text-white  text-sm lg:text-base'>
              CBIR dengan parameter tekstur melibatkan konversi gambar ke skala
              keabuan, pembuatan co-occurrence matrix untuk ekstraksi tekstur,
              dan pengukuran tingkat kemiripan antara vektor-fitur tekstur dari
              gambar query dan dataset menggunakan cosine similarity.
            </p>
          </div>

          <p className='text-white'>
            Integrasi kedua parameter ini memungkinkan CBIR untuk memberikan
            hasil pencarian yang lebih akurat dan efisien, mengurangi
            ketergantungan pada pencarian berbasis teks atau kata kunci, dan
            memberikan pengalaman eksplorasi koleksi gambar yang lebih intuitif.
            Dengan demikian, CBIR menjadi alat yang efektif dalam membantu
            pengguna mengeksplorasi dan mengakses gambar berdasarkan kesamaan
            nilai citra visual.
          </p>
        </div>
      </section>
      <FeatureSection
        title1='Feature?'
        title2='Fitur Aplikasi'
        items={features}
      />
      <FeatureSection
        title1='How to use?'
        title2='Panduan Penggunaan Aplikasi'
        items={howToUseSteps}
      />
    </main>
  );
}
