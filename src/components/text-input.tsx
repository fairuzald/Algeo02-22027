import React, { SetStateAction } from 'react';

export default function TextInput({
  input,
  setInput,
  placeHolder,
}: {
  input: string;
  setInput: React.Dispatch<SetStateAction<string>>;
  placeHolder: string;
}) {
  return (
    <div
      className={`flex flex-1 gap-3 bg-white py-1.5 px-4 lg:px-6 lg:py-2  w-full justify-between items-center rounded-md duration-150 ease-in`}
    >
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInput(e.target.value);
        }}
        type='text'
        value={input}
        placeholder={placeHolder}
        className={`text-black outline-none disabled:cursor-not-allowed  font-medium text-sm w-full lg:text-base`}
      />
    </div>
  );
}
