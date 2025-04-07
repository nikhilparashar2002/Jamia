"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center py-4 px-5 text-left group bg-gray-50"
          >
            <span className="text-lg font-semibold text-[#003057] font-poppins pr-8">
              Q{index+1}: {faq.question}
            </span>
            <span className={`
              text-[#003057] flex-shrink-0 
              transition-transform duration-500 ease-in-out
              ${openIndex === index ? 'rotate-180' : 'rotate-0'}
              group-hover:scale-110
            `}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-5 w-5 transform transition-all duration-500
                  ${openIndex === index ? 'rotate-45 scale-110' : 'rotate-0'}
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </button>
          
          <div
            className={`
              overflow-hidden transition-all duration-500 ease-in-out
              ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-5 py-4 bg-white">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
