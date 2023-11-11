//  Use stroke to color icons

const XIcon = ({ size, className }: { size: number; className: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className={className}
    >
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </svg>
  );
};

export default XIcon;
