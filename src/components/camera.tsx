'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CustomLink from '@/components/custom-link';
import { usePathname } from 'next/navigation';

const Camera: React.FC<{ onCapture: (dataUrl: string) => void }> = ({
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);
  console.log(image);
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Mengakses webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // Mengatur interval waktu untuk menangkap gambar
    const interval = setInterval(() => {
      captureImage();
      setCountdown(10);
    }, 10000); // Menangkap gambar setiap 10 detik

    return () => {
      clearInterval(interval);

      // Menutup kamera ketika komponen di-unmount
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // countdown reduce
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countdown]);

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setImage(dataUrl);
        onCapture(dataUrl);
      }
    }
  };
  const pathname = usePathname();
  return (
    <div className='flex flex-col gap-8 items-center justify-center'>
      <div className='flex flex-col lg:flex-row justify-center gap-10 w-full items-center lg:items-stretch'>
        <div className='w-full lg:w-1/2 flex flex-col items-center justify-center gap-4'>
          <video
            ref={videoRef}
            width={640}
            height={480}
            autoPlay
            className='h-full max-lg:max-h-[280px] lg:h-[320px] 2xl:h-[480px] w-full bg-transparent'
          ></video>

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: 'none' }}
          ></canvas>
          <p className='text-white font-poppins text-base lg:text-xl text-center'>
            Video
          </p>
        </div>
        <div className='w-full lg:w-1/2 flex flex-col items-center justify-center gap-4'>
          <Image
            width={640}
            height={480}
            src={image ? image : '/white.jpg'}
            alt='Captured image'
            priority
            className='h-full max-lg:max-h-[280px] lg:h-[320px] 2xl:h-[480px] w-full bg-transparent object-contain object-center'
          />
          <p className='text-white font-poppins text-base lg:text-xl text-center'>
            {countdown > 0 ? 'Catch Image in ' + countdown : 'Cheese!!!'}{' '}
            {countdown > 0 && countdown == 1
              ? 'second'
              : countdown > 0 && 'seconds'}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-center gap-4'>
        <p className='text-lg lg:text-2xl font-poppins font-semibold text-gold'>
          Other Input Query Option:
        </p>
        <CustomLink color='gradient-bp' href={pathname} size='medium'>
          File Upload
        </CustomLink>
      </div>
    </div>
  );
};

export default Camera;
