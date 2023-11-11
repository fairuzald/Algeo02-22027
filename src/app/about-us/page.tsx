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
          asisten dan dosen kami, terutama Bapak Rinaldi Munir, yang telah
          memberikan bimbingan dan ilmu yang berharga dalam mata kuliah ini.
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
