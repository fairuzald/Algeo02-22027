'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);
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
    };
  }, []);

  // countdowndown reduce
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }),
    [countdown];

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setImage(dataUrl);
      }
    }
  };

  return (
    <div className='flex gap-10 w-full items-stretch'>
      <div className='w-1/2 flex flex-col items-center justify-center gap-4'>
        <video
          ref={videoRef}
          width={640}
          height={480}
          autoPlay
          className='h-[480px] bg-[#d9d9d9]'
        ></video>

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: 'none' }}
        ></canvas>
        <p className='text-white font-poppins text-xl text-center'>Video</p>
      </div>
      <div className='w-1/2 flex flex-col items-center justify-center gap-4'>
        <Image
          width={640}
          height={480}
          src={image}
          alt='Captured image'
          className='h-[480px] bg-[#d9d9d9] object-contain object-center'
        />
        <p className='text-white font-poppins text-xl text-center'>
          {countdown > 0 ? 'Catch Image in ' + countdown : 'Cheese!!!'}{' '}
          {countdown > 0 && countdown == 1
            ? 'second'
            : countdown > 0 && 'seconds'}
        </p>
      </div>
    </div>
  );
};

export default Camera;
