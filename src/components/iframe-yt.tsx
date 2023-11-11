'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';

const YoutubeIframe = ({ youtubeId }: { youtubeId: string }) => {
  useEffect(() => {
    const youtubeVideos = document.querySelectorAll('[data-youtube]');

    youtubeVideos.forEach((element) => {
      const button = element.querySelector('[data-youtube-button]');
      button && button.addEventListener('click', createIframe);
    });

    function createIframe(event: any) {
      const url = event.target.dataset.youtubeButton;
      const youtubePlaceholder = event.target.parentNode;

      const htmlString = `<div class="video__youtube">
        <iframe
          class="h-[250px] md:h-[300px] w-full max-w-[400px] lg:h-[20vw] lg:w-[30vw] lg:max-w-[600px] lg:max-h-[500px] video__iframe"
          src="${url}?autoplay=1"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>`;

      youtubePlaceholder.style.display = 'none';

      if (youtubePlaceholder.parentNode) {
        youtubePlaceholder.insertAdjacentHTML('beforebegin', htmlString);
        youtubePlaceholder.parentNode.removeChild(youtubePlaceholder);
      }
    }
  }, []);

  return (
    <div className='video'>
      <div className='video__youtube' data-youtube>
        <Image
          src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt='Video Thumbnail'
          width={600}
          height={500}
          sizes='(max-width: 1024px) 100%, 30vw'
          className=' h-[250px] md:h-[300px] object-contain w-full max-w-[400px] lg:h-[20vw] lg:w-[30vw] lg:max-w-[600px] lg:max-h-[500px]'
        />
        <button
          aria-label='Youtube Button'
          className='youtube__button'
          data-youtube-button={`https://www.youtube.com/embed/${youtubeId}`}
        ></button>
      </div>

      <style jsx>{`
        .video {
          position: relative;
          width: 100%;
        }

        .video__iframe {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .video__placeholder {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .video__youtube {
          width: 100%;
          overflow: hidden;
          position: relative;
          object-fit: cover;
          background-color: black;
        }

        .youtube__button {
          background: none;
          border: 0;
          cursor: pointer;
          height: 100%;
          left: 0;
          position: absolute;
          /* text-indent: -9999px; */
          top: 0;
          transition: transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
          width: 100%;
        }

        .youtube__button:before {
          width: 100%;
          height: 100%;
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: url(/youtube.svg) no-repeat center center;
          background-size: 14%;
        }

        .youtube__button:hover:before {
          background: url(/youtube.svg) no-repeat center center;
          background-size: 14%;
        }
      `}</style>
    </div>
  );
};

export default YoutubeIframe;
