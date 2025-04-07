"use client";
import React from "react"; 
import { useState } from "react";

interface TOCItem {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function getItemNumber(
    index: number,
    item: TOCItem,
    allItems: TOCItem[]
  ): string {
    let mainCount = 0;
    let subCount = 0;

    for (let i = 0; i <= index; i++) {
      if (allItems[i].level === 2) {
        mainCount++;
        subCount = 0; // reset child counter for a new parent
        if (i === index && item.level === 2) return mainCount.toString();
      } else if (allItems[i].level === 3) {
        if (mainCount === 0) {
          mainCount = 1;
        }
        subCount++;
        if (i === index && item.level === 3) return `${mainCount}.${subCount}`;
      }
    }
    return "";
  }

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = `#${id}`;
    }
  };

  const getIndentClass = (level: number) => {
    return level === 3 ? "ml-4" : "";
  };

  return (
    <div
      className={`box-border m-0 p-[10px_20px_10px_10px] border-[0.8px] border-solid border-[#aaa] 
      rounded-[4px] bg-[#edf6ff] shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] mb-[14px] relative 
      font-['Poppins',sans-serif] transition-all duration-300 ease-in-out
      ${isOpen ? "w-[400px]" : "w-[300px]"}`}
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-[16.8px] font-medium leading-[24.36px] m-0 p-0">
          Table of Contents
        </p>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Table of Contents"
          className="ml-[10px] px-[5px] py-[1px] text-[12px] text-[#444] hover:bg-gray-200 transition-colors rounded flex items-center"
        >
          <span className="border border-[#999191] rounded-[5px] w-[35px] h-[30px] flex items-center justify-center">
            <span className="flex items-center">
              {/* Menu Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="fill-[#999]"
              >
                <path d="M6 6H4v2h2V6zm14 0H8v2h12V6zM4 11h2v2H4v-2zm16 0H8v2H12v-2zM4 16h2v2H4v-2zm16 0H8v2H12v-2z" />
              </svg>
              {/* Toggle Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                className="fill-[#999]"
              >
                <path
                  d={
                    isOpen
                      ? "M18.2 14.7l-6.2 6.3-6.2-6.3c-.2-.2-.3-.4-.3-.7s.1-.5.3-.7c.2-.2.4-.3.7-.3h11c.3 0 .5.1.7.3.2.2.3.5.3.7s-.1.5-.3.7z"
                      : "M18.2 9.3l-6.2-6.3-6.2 6.3c-.2.2-.3.4-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7z"
                  }
                />
              </svg>
            </span>
          </span>
        </button>
      </div>

      {/* Wrap nav with transition container */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <nav>
          <ul className="m-0 p-0 list-none text-[14px] overflow-hidden z-[1]">
            {items.map((heading, index) => (
              <li
                key={heading.id}
                onClick={() => handleHeadingClick(heading.id)}
                className={`${getIndentClass(
                  heading.level
                )} mb-2 cursor-pointer hover:text-blue-600 transition-colors`}
              >
                <span className="text-[13.3px] font-medium leading-[21.28px]">
                  {getItemNumber(index, heading, items)} {heading.text}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
