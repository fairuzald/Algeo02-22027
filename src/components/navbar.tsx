'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { usePathname } from 'next/navigation';
import MenuIcon from './icons/menu-icon';
import XIcon from './icons/x-icon';

const NavBar = () => {
  const [navBarExpanded, setNavBarExpanded] = useState(false);
  // List of paths
  const paths = [
    {
      name: 'CBIR',
      url: '/cbir',
    },
    { name: 'Scrapping', url: '/scrapping' },
    {
      name: 'About Us',
      url: '/about-us',
    },
  ];

  // Get pathname
  const pathname = usePathname();

  // Side Bar background ref
  const sideBarBgRef = useRef<HTMLDivElement>(null);

  // Close Navbar when user clicks on black background stuffs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If Userclick is in the black background stuff
      if (
        sideBarBgRef.current &&
        sideBarBgRef.current.contains(event.target as Node)
      ) {
        setNavBarExpanded(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setNavBarExpanded]);

  return (
    <nav className='sticky left-0 right-0 top-0 z-40 flex h-16 w-full flex-row items-center justify-between bg-[#183256] px-5 lg:px-20 xl:h-[70px]'>
      {/* Logo Icon */}
      <Link href='/' className='font-poppins text-xl font-bold xl:text-2xl'>
        <span className='bg-gradient-to-r from-[#1363D9] to-[#7939d4] bg-clip-text text-transparent'>
          Cukurukuk
        </span>
        <span className='text-gold-light'>Team</span>
        <span className='text-gold-light'>.</span>
      </Link>

      {/* Menu Icon Button */}
      <button
        aria-label='Menu'
        className='block w-fit lg:hidden'
        onClick={() => setNavBarExpanded(!navBarExpanded)}
      >
        <MenuIcon size={30} className='stroke-white' />
      </button>

      <div
        className={`fixed right-0 top-0 z-10 flex h-full w-[230px] flex-col gap-6 bg-[#183256] p-5 font-poppins text-base font-semibold duration-300 ease-in-out lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center lg:gap-12 lg:border-none lg:bg-transparent  lg:p-0 xl:text-lg ${
          navBarExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          aria-label='Menu'
          className='block w-fit self-end lg:hidden'
          onClick={() => setNavBarExpanded(!navBarExpanded)}
        >
          <XIcon size={30} className='stroke-white' />
        </button>

        {/* Path lists */}
        <ul className='flex flex-col lg:flex-row lg:gap-16'>
          {paths.map((path, index) => {
            return (
              <Link
                key={index}
                href={path.url}
                className='xl:after:block xl:after:scale-x-0 xl:after:border-b-2 xl:after:border-b-custom-blue-green xl:after:transition xl:after:duration-200 xl:after:ease-in-out xl:hover:after:scale-x-50'
              >
                <li
                  className={`py-2 ${
                    pathname.startsWith(path.url)
                      ? 'text-gold-light'
                      : 'text-white xl:transition-colors xl:duration-200 xl:ease-in-out transition-all duration-300 hover:text-gold-light'
                  }`}
                >
                  {path.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>

      {/* Side bar opaque background */}
      {navBarExpanded && (
        <div
          ref={sideBarBgRef}
          className='fixed inset-0 z-0 h-full w-full bg-opacity-40 bg-black  backdrop-blur-sm lg:hidden'
        />
      )}
    </nav>
  );
};

export default NavBar;
