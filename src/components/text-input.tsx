import React, { SetStateAction } from 'react';

export default function TextInput({
  input,
  setInput,
  placeHolder,
  type,
  disabled,
}: {
  input: any;
  setInput: React.Dispatch<SetStateAction<any>>;
  placeHolder: string;
  type: 'number' | 'text';
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 gap-3 bg-white py-1.5 px-4 lg:px-6 lg:py-2  w-full justify-between items-center rounded-md duration-150 ease-in`}
    >
      <input
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (type === 'number') {
            const value = parseInt(e.target.value);
            if (value >= 0 && !isNaN(value)) {
              setInput(value);
            }
          } else {
            setInput(e.target.value);
          }
        }}
        type={type}
        value={input}
        placeholder={placeHolder}
        className={`text-black outline-none disabled:cursor-not-allowed  font-medium text-sm w-full lg:text-base`}
      />
    </div>
  );
}
