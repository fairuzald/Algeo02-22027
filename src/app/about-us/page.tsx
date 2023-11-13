import React from 'react';

export default function AboutUsPage() {
  return (
    <main className='flex items-center justify-center gap-8 text-white lg:gap-10 min-h-screen flex-col py-20 px-8 sm:px-10 md:px-20 lg:px-40 bg-gradient-to-tr from-[#455976] via-[55%] via-[#2A182e]  to-[#8b3f25]'>
      <div className='font-poppins text-white flex flex-col gap-10'>
        <h1 className='text-2xl lg:text-4xl font-bold tracking-wider text-center flex gap-2 items-center justify-center'>
          <span className='text-yellow-500'>About</span>
          Us
        </h1>
        <div className='text-sm lg:text-base flex flex-col gap-3 leading-6 lg:leading-7'>
          Selamat datang di halaman "About Us" Aplikasi Tugas Besar Aljabar dan
          Geometri II! Kami, kelompok "Cukurukuk", dengan rasa syukur kepada
          Allah SWT, ingin menyampaikan apresiasi dan terima kasih kepada semua
          pihak yang telah memberikan dukungan dan bimbingan selama perjalanan
          pembuatan aplikasi ini. Kami juga mengucapkan terima kasih kepada para
          asisten dan dosen kami, terutama Bapak Rinaldi Munir dan Bapak Judhi
          Santoso, yang telah memberikan bimbingan dan ilmu yang berharga dalam
          mata kuliah ini.
          <br />
          <span className='font-bold'>Nama Kelompok: Cukurukuk</span>
          <ol className='list-decimal px-10'>
            <li>Muhammad Al Thariq Fairuz (13522027)</li>
            <li>Moh Fairuz Alauddin Yahya (13522057)</li>
            <li>Randy Verdian (13522067)</li>
          </ol>
          <p>
            Dengan kerja sama, integritas, dan semangat kebersamaan,
            Alhamdulillah kami masih bisa{' '}
            <span className='font-bold'>turu dengan baik.</span>
            Muakasi lo kepada para asisten yang memberikan tugas besar ini
            dengan sangat mantap dan full senyum :(. Semoga aplikasi ini dapat
            memberikan kontribusi positif dalam pemahaman dan penerapan
            konsep-konsep Aljabar dan Geometri II. Jika ada masukan atau
            pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami.
          </p>
          <p className='ml-auto mt-4 flex flex-col justify-items-end items-end'>
            Salam, <span>Kelompok "Cukurukuk" </span>
          </p>
        </div>
      </div>
    </main>
  );
}
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CBIR Cukuruk',
  description:
    'Selamat datang di halaman Content-Based Image Retrieval (CBIR) kami. Di sini, Anda dapat menggali ke dalam keindahan dunia visual dengan menggunakan teknologi pencarian berbasis konten. Unggah gambar Anda atau pilih dari koleksi kami, dan biarkan CBIR menganalisisnya. Parameter warna dan tekstur dipergunakan untuk menghasilkan pencarian yang presisi, memungkinkan Anda menemukan gambar dengan kesamaan nilai citra visual.',
  generator: 'Next.js',
  category: 'TUBES',
  applicationName: 'CBIR Cukuruk',
  referrer: 'origin-when-cross-origin',
  keywords: ['CBIR Cukuruk'],
  colorScheme: 'normal',
  alternates: {
    canonical: '/about-us',
    languages: {
      'en-US': '/en-US/about-us',
      'id-ID': '/id-ID/about-us',
    },
  },
  metadataBase: new URL('http://localhost:3000/'),
  openGraph: {
    title: 'CBIR Cukuruk',
    description:
      'Selamat datang di halaman Content-Based Image Retrieval (CBIR) kami. Di sini, Anda dapat menggali ke dalam keindahan dunia visual dengan menggunakan teknologi pencarian berbasis konten. Unggah gambar Anda atau pilih dari koleksi kami, dan biarkan CBIR menganalisisnya. Parameter warna dan tekstur dipergunakan untuk menghasilkan pencarian yang presisi, memungkinkan Anda menemukan gambar dengan kesamaan nilai citra visual.',
    url: 'http://localhost:3000/',
    siteName: 'CBIR Cukuruk',
    // images: [
    //   {
    //     url: 'https://www.datocms-assets.com/104656/1697807711-sandbox.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'CBIR Cukuruk Logo',
    //   },
    // ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBIR Cukuruk',
    description:
      'Selamat datang di halaman Content-Based Image Retrieval (CBIR) kami. Di sini, Anda dapat menggali ke dalam keindahan dunia visual dengan menggunakan teknologi pencarian berbasis konten. Unggah gambar Anda atau pilih dari koleksi kami, dan biarkan CBIR menganalisisnya. Parameter warna dan tekstur dipergunakan untuk menghasilkan pencarian yang presisi, memungkinkan Anda menemukan gambar dengan kesamaan nilai citra visual.',
    // images: [
    //   {
    //     url: 'https://www.datocms-assets.com/104656/1697807711-sandbox.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'CBIR Cukuruk Logo',
    //   },
    // ],
  },
};
