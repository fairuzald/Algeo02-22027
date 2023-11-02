import React from 'react';
interface ButtonProps {
  color: 'gradient-bp';
  isRounded?: boolean;
  size: 'small' | 'medium';
  children: React.ReactNode;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({
  color,
  isRounded,
  size,
  children,
  onClick,
}) => {
  const sizeEffect = {
    small: 'py-2 px-8',
    medium: 'py-3 px-4',
  };
  const colorEffect = {
    'gradient-bp': 'bg-gradient-to-r from-[#1363D9] to-[#7939d4]',
  };
  return (
    <button
      onClick={onClick}
      aria-label={children?.toString()}
      className={`text-sm lg:text-base ${
        isRounded ? 'rounded-full' : 'rounded-lg'
      } font-semibold font-poppins text-center ${sizeEffect[size]} ${
        colorEffect[color]
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
