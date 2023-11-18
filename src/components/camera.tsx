'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CustomLink from '@/components/custom-link';
import { usePathname } from 'next/navigation';
import { makeApiRequest } from '@/lib/helper';
import toast from 'react-hot-toast';
import Button from '@/components/button';

interface CameraProps {
  imageData: string;
  setImageData: React.Dispatch<React.SetStateAction<string>>;
  isLoadingOutside?: boolean;
  triggerCBIRProcessing: (imageQuery: string) => void;
}

const Camera: React.FC<CameraProps> = ({
  imageData,
  setImageData,
  isLoadingOutside = false,
  triggerCBIRProcessing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const captureImage = async () => {
    setIsLoading(true);

    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        if (dataUrl) {
          makeApiRequest({
            body: JSON.stringify({ image_data: dataUrl }),
            method: 'POST',
            loadingMessage: 'Camera image processing...',
            successMessage: 'Camera image processing successful!',
            endpoint: '/api/convert-camera',
            onSuccess: (data) => {
              if (data) {
                setImageData(data.base64);
                setIsLoading(false);
                triggerCBIRProcessing(data.base64 as string);
              }
            },
          });
        } else {
          setIsLoading(false);
          toast.error('Failed to capture image!');
        }
      }
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });

    const interval = setInterval(() => {
      if (!isLoading && !isLoadingOutside) {
        setCountdown((prevCountdown) =>
          prevCountdown > 0 ? prevCountdown - 1 : 10
        );

        if (countdown === 0) {
          captureImage();
          setCountdown(10); // Reset countdown to 10 after it reaches 0
        }
      }
    }, 1000); // Update countdown every second

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, isLoadingOutside, facingMode, countdown]);

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
            playsInline
            className='h-full max-lg:max-h-[280px] lg:h-[320px] 2xl:h-[480px] w-full bg-transparent'
          ></video>
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className='hidden'
          ></canvas>
          <Button size='small' color='gradient-bp' onClick={flipCamera}>
            Flip Camera
          </Button>
        </div>
        <div className='w-full lg:w-1/2 flex flex-col items-center justify-center gap-4'>
          <Image
            width={640}
            height={480}
            src={imageData ? imageData : '/white.jpg'}
            alt='Captured imageData'
            priority
            className='h-full max-lg:max-h-[280px] lg:h-[320px] 2xl:h-[480px] w-full bg-transparent object-contain object-center'
          />
          <p className='text-white font-poppins text-base lg:text-xl text-center'>
            {isLoading || isLoadingOutside
              ? 'Data gambar sedang diolah'
              : countdown > 0
              ? `Catch Image in ${countdown} ${
                  countdown === 1 ? 'second' : 'seconds'
                }`
              : 'Cheese!!!'}
          </p>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-4'>
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
