import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import NavBar from '@/components/navbar';
import { Metadata } from 'next';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${poppins.variable}`}
      >
        <Toaster />
        <NavBar />
        {children}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'CBIR Cukuruk',
  description:
    'Selamat datang di halaman utama kami! Temukan keindahan dunia visual dengan Content-Based Image Retrieval (CBIR). Jelajahi koleksi gambar kami secara intuitif melalui representasi matriks dan vektor-fitur, dengan parameter warna dan tekstur untuk hasil pencarian yang akurat. CBIR memungkinkan Anda menavigasi koleksi gambar dengan mudah, memberikan pengalaman eksplorasi visual yang menarik dan efisien. Temukan gambar berdasarkan kesamaan nilai citra visual tanpa ketergantungan pada teks atau kata kunci. Selamat menikmati pengalaman pencarian yang lebih intuitif dan interaktif!',
  generator: 'Next.js',
  category: 'TUBES',
  applicationName: 'CBIR Cukuruk',
  referrer: 'origin-when-cross-origin',
  keywords: ['CBIR Cukuruk'],
  colorScheme: 'normal',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US/',
      'id-ID': '/id-ID/',
    },
  },
  metadataBase: new URL('http://localhost:3000/'),
  openGraph: {
    title: 'CBIR Cukuruk',
    description:
      'Selamat datang di halaman utama kami! Temukan keindahan dunia visual dengan Content-Based Image Retrieval (CBIR). Jelajahi koleksi gambar kami secara intuitif melalui representasi matriks dan vektor-fitur, dengan parameter warna dan tekstur untuk hasil pencarian yang akurat. CBIR memungkinkan Anda menavigasi koleksi gambar dengan mudah, memberikan pengalaman eksplorasi visual yang menarik dan efisien. Temukan gambar berdasarkan kesamaan nilai citra visual tanpa ketergantungan pada teks atau kata kunci. Selamat menikmati pengalaman pencarian yang lebih intuitif dan interaktif!',
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
      'Selamat datang di halaman utama kami! Temukan keindahan dunia visual dengan Content-Based Image Retrieval (CBIR). Jelajahi koleksi gambar kami secara intuitif melalui representasi matriks dan vektor-fitur, dengan parameter warna dan tekstur untuk hasil pencarian yang akurat. CBIR memungkinkan Anda menavigasi koleksi gambar dengan mudah, memberikan pengalaman eksplorasi visual yang menarik dan efisien. Temukan gambar berdasarkan kesamaan nilai citra visual tanpa ketergantungan pada teks atau kata kunci. Selamat menikmati pengalaman pencarian yang lebih intuitif dan interaktif!',
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
