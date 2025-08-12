'use client';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = {
    home: [],
    foodDrinks: [
      { name: 'French Fries', href: '/food' },
      { name: 'Showarma', href: '/food' },
      { name: 'Burgers', href: '/food' },
      { name: 'Beverages', href: '/food' },
    ],
    homeItems: [
      { name: 'Furniture', href: '#' },
      { name: 'Kitchenware', href: '#' },
      { name: 'Decor', href: '#' },
      { name: 'Bedding', href: '#' },
    ],
    internet: [
      { name: 'Home Internet', href: '#' },
      { name: 'Mobile Plans', href: '#' },
      { name: 'Business Solutions', href: '#' },
    ],
    realEstates: [
      { name: 'Residential', href: '#' },
      { name: 'Commercial', href: '#' },
      { name: 'Vacation Homes', href: '#' },
    ],
    signupPlanning: [
      { name: 'Events', href: '#' },
      { name: 'Consultation', href: '#' },
      { name: 'Packages', href: '#' },
    ],
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={'/assets/icons/logo.png'}
            alt="Flamingo Logo"
            width={160}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6">
          <Dropdown title="Home" items={menuItems.home} />
          <Dropdown title="Food & Drinks" items={menuItems.foodDrinks} />
          <Dropdown title="Home Items" items={menuItems.homeItems} />
          <Dropdown title="Internet" items={menuItems.internet} />
          <Dropdown title="Real Estates" items={menuItems.realEstates} />
          <Dropdown title="Explore Flamingo" items={menuItems.signupPlanning} dark />
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <MobileDropdown title="Home" items={menuItems.home} />
          <MobileDropdown title="Food & Drinks" items={menuItems.foodDrinks} />
          <MobileDropdown title="Home Items" items={menuItems.homeItems} />
          <MobileDropdown title="Internet" items={menuItems.internet} />
          <MobileDropdown title="Real Estates" items={menuItems.realEstates} />
          <MobileDropdown title="Explore Flamingo" items={menuItems.signupPlanning} />
        </div>
      )}
    </header>
  );
};

// Desktop Dropdown Component
const Dropdown = ({
  title,
  items,
  dark = false,
}: {
  title: string;
  items: { name: string; href: string }[];
  dark?: boolean;
}) => (
  <div className={`group relative ${dark ? 'bg-black rounded' : ''}`}>
    <a
      href="#"
      className={`flex items-center p-2 ${dark ? 'text-white' : 'text-black'} hover:text-[#f47c5b]`}
    >
      {title}
      <FaChevronDown className="ml-1 text-xs opacity-70 group-hover:opacity-100 transition-opacity" />
    </a>
    {items.length > 0 && (
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600"
          >
            {item.name}
          </a>
        ))}
      </div>
    )}
  </div>
);

// Mobile Dropdown Component
const MobileDropdown = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; href: string }[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-black font-medium py-2"
      >
        {title}
        <FaChevronDown className={`ml-2 text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && items.length > 0 && (
        <div className="mt-1 ml-4 space-y-2">
          {items.map((item, index) => (
            <a key={index} href={item.href} className="block text-sm text-gray-700">
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
