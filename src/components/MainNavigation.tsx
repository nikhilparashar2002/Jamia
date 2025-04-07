"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between py-4">
        
        {/* Logo Instead of Brand Name */}
        <Link href="/">
          <Image 
            src="/logo.png"
            alt="Site Logo"
            width={250}
            height={75}
            className="cursor-pointer hover:opacity-80 transition duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold text-black">
          <li>
            <Link href="/category/science" className="hover:text-yellow-300 transition duration-300">
              Science Courses
            </Link>
          </li>
          <li>
            <Link href="/category/maths" className="hover:text-yellow-300 transition duration-300">
              Management Courses
            </Link>
          </li>
          <li>
            <Link href="/category/arts" className="hover:text-yellow-300 transition duration-300">
              Arts Courses
            </Link>
          </li>
          <li>
            <Link href="/category/commerce" className="hover:text-yellow-300 transition duration-300">
              Commerce Courses
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-yellow-300 transition duration-300">
              Blog
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-[#F0FDFF] shadow-md p-6 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-[10000]`}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-black text-2xl" onClick={toggleMenu}>
          ✖
        </button>

        {/* Menu Links */}
        <nav className="flex flex-col space-y-6 mt-8">
          <Link href="/category/science" className="text-black text-lg font-semibold hover:text-yellow-300 transition" onClick={closeMenu}>
            Science Courses
          </Link>
          <Link href="/category/management" className="text-black text-lg font-semibold hover:text-yellow-300 transition" onClick={closeMenu}>
          Management Courses
          </Link>
          <Link href="/category/arts" className="text-black text-lg font-semibold hover:text-yellow-300 transition" onClick={closeMenu}>
          Arts Courses
          </Link>
          <Link href="/category/commerce" className="text-black text-lg font-semibold hover:text-yellow-300 transition" onClick={closeMenu}>
          Commerce Courses
          </Link>
          <Link href="/blog" className="text-black text-lg font-semibold hover:text-yellow-300 transition" onClick={closeMenu}>
            Blog
          </Link>
        </nav>
      </div>
    </nav>
  );
}
