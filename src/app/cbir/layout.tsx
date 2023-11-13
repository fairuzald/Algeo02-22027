import { Metadata } from 'next';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: 'CBIR File | CBIR Cukuruk',
  description:
    'Selamat datang di halaman Content-Based Image Retrieval (CBIR) kami. Di sini, Anda dapat menggali ke dalam keindahan dunia visual dengan menggunakan teknologi pencarian berbasis konten. Unggah gambar Anda atau pilih dari koleksi kami, dan biarkan CBIR menganalisisnya. Parameter warna dan tekstur dipergunakan untuk menghasilkan pencarian yang presisi, memungkinkan Anda menemukan gambar dengan kesamaan nilai citra visual.',
  generator: 'Next.js',
  category: 'TUBES',
  applicationName: 'CBIR Cukuruk',
  referrer: 'origin-when-cross-origin',
  keywords: ['CBIR Cukuruk'],
  colorScheme: 'normal',
  alternates: {
    canonical: '/cbir',
    languages: {
      'en-US': '/en-US/cbir',
      'id-ID': '/id-ID/cbir',
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
