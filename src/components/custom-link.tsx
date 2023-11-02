import Link from 'next/link';
import React from 'react';
interface CustomLinkProps {
  color: 'gradient-bp';
  isRounded?: boolean;
  size: 'small' | 'medium';
  children: React.ReactNode;
  href: string;
}
const CustomLink: React.FC<CustomLinkProps> = ({
  color,
  isRounded,
  size,
  children,
  href,
}) => {
  const sizeEffect = {
    small: 'py-2 px-8',
    medium: 'py-3 px-4',
  };
  const colorEffect = {
    'gradient-bp': 'bg-gradient-to-r from-[#1363D9] to-[#7939d4]',
  };
  return (
    <Link
      href={href}
      aria-label={children?.toString()}
      className={`text-sm lg:text-base ${
        isRounded ? 'rounded-full' : 'rounded-lg'
      } font-semibold font-poppins text-center ${sizeEffect[size]} ${
        colorEffect[color]
      }`}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
