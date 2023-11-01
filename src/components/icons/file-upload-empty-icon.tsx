import React from 'react';

export default function FileUploadEmpty({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 204 154'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g id='Group'>
        <path
          id='Vector'
          d='M194.308 2H9.69231C5.44396 2 2 4.91988 2 8.52174V112.87C2 116.471 5.44396 119.391 9.69231 119.391H194.308C198.556 119.391 202 116.471 202 112.87V8.52174C202 4.91988 198.556 2 194.308 2Z'
          stroke='#DBB88B'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          id='Vector_2'
          d='M86.6154 119.391L71.2308 152M117.385 119.391L132.769 152M55.8462 152H148.154M140.462 60.6957H63.5385M102 28.087V93.3044'
          stroke='#DBB88B'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
    </svg>
  );
}
