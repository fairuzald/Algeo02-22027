export const howToUseSteps = [
  {
    title: 'Akses Halaman CBIR dan Scrapping',
    description:
      'Buka aplikasi dan akses halaman "CBIR" untuk melakukan proses Content-Based Image Retrieval (CBIR) dengan dataset file input. Kunjungi halaman "Scrapping" untuk melakukan input URL dan melakukan web scrapping.',
  },
  {
    title: 'Pilihan Input Query',
    description:
      'Di setiap halaman, Anda dapat memilih opsi input query dengan dua cara:',
    options: [
      'Kamera: Pilih opsi ini jika Anda ingin menggunakan kamera perangkat untuk mengambil gambar sebagai query.',
      'Upload File: Gunakan opsi ini untuk mengunggah file gambar dari penyimpanan perangkat sebagai query.',
    ],
  },
  {
    title: 'Pilih Jenis Pengolahan CBIR',
    description:
      'Setelah memilih query, pilih jenis pengolahan CBIR yang diinginkan, apakah berdasarkan warna atau tekstur.',
  },
  {
    title: 'Otomatisasi Pengolahan dengan YOLO Detector',
    description:
      'Gambar yang diunggah akan otomatis diolah menggunakan Object Detector berbasis YOLO untuk melakukan proses cropping secara otomatis.',
  },
  {
    title: 'Proses Pencarian dan Tampilan Hasil',
    description:
      'Tekan tombol "Search" untuk memulai proses pencarian cosine similarities antara gambar query dan dataset. Program akan menampilkan kumpulan gambar yang mirip, diurutkan berdasarkan tingkat kemiripan. Setiap gambar akan disertai dengan persentase kemiripannya.',
  },
  {
    title: 'Informasi Tambahan',
    description:
      'Informasi terkait jumlah gambar yang muncul, dan waktu eksekusi programnya akan ditampilkan.',
  },
  {
    title: 'Download Hasil dalam Format PDF',
    description:
      'Setelah proses selesai, Anda dapat mengunduh hasil analisis dengan menekan tombol "Download PDF". Ini memungkinkan penyimpanan dan berbagi hasil secara praktis.',
  },
];
