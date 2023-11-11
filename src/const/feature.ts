export const features = [
  {
    title: 'Mencari Nilai Cosine Similarities',
    description:
      'Aplikasi ini memberikan kemampuan untuk mencari nilai cosine similarities antara gambar query dan dataset. Dengan ini, pengguna dapat dengan mudah mengevaluasi sejauh mana suatu gambar dalam dataset serupa dengan gambar query yang diberikan.',
  },
  {
    title: 'Metode Input Image Query',
    description: 'Pengguna dapat memilih opsi input query dengan dua cara:',
    options: [
      'Kamera: Pengguna dapat langsung menggunakan kamera perangkat untuk mengambil gambar sebagai query.',
      'Upload File: Pengguna dapat mengunggah file gambar dari penyimpanan perangkat mereka untuk digunakan sebagai query.',
    ],
  },
  {
    title: 'Input Dataset',
    description:
      'Dataset dapat diunggah atau dikumpulkan melalui web scraping:',
    options: [
      'Folder Uploads: Dataset dapat diunggah dalam bentuk folder, memungkinkan pengguna mengelompokkan gambar dalam struktur direktori yang terorganisir.',
      'Web Scraping: Aplikasi memberikan opsi untuk mengumpulkan dataset secara otomatis dari web, memberikan fleksibilitas dalam pengumpulan data.',
    ],
  },
  {
    title: 'Implementasi Object Detector dengan YOLO',
    description:
      'Aplikasi mengintegrasikan Object Detector berbasis YOLO (You Only Look Once) untuk melakukan proses cropping otomatis pada gambar. Ini membantu memperbaiki hasil pencarian dengan memastikan bahwa hanya bagian relevan dari gambar yang digunakan dalam perhitungan cosine similarities.',
  },
  {
    title: 'Download Hasil dalam Format PDF',
    description:
      'Pengguna dapat mengunduh hasil pencarian cosine similarities dalam format PDF. Fitur ini memungkinkan pengguna untuk menyimpan dan berbagi hasil analisis mereka dengan mudah, memberikan kemudahan aksesibilitas dan kolaborasi.',
  },
];
