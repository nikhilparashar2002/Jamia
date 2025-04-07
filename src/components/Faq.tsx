"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "Can I Pursue Multiple IGNOU Courses Simultaneously Online?",
    answer: "Yes, University allows students to enroll in multiple programs simultaneously, but with some restrictions. Typically, you can pursue one bachelor's and one master's program at the same time, or two different master's programs. However, it's important to check the specific guidelines and eligibility for each course you wish to pursue."
  },
  {
    question: "What Financial Assistance or Scholarships are Available for IGNOU Online Courses?",
    answer: "IGNOU offers various scholarships and financial assistance programs to eligible students. These may include scholarships for economically disadvantaged students, SC/ST scholarships, and scholarships for students with disabilities. Additionally, It collaborates with government and non-governmental organizations to provide financial support to deserving candidates."
  },
  {
    question: "Is IGNOU Online Learning Suitable for Working Professionals?",
    answer: "Absolutely! Universities online courses are designed to be flexible, making them an excellent choice for working professionals. You can study at your own pace and access course materials online, allowing you to balance your job and education effectively. However, it's essential to manage your time efficiently to meet course requirements."
  },
  {
    question: "How Can I Access the IGNOU Syllabus and Study Materials Online?",
    answer: "IGNOU provides course syllabus and study materials on its official website. Once you are enrolled in a program, you can log in to the Student Zone on the website to access these resources. Additionally, IGNOU has a dedicated eGyanKosh platform where you can find digital course materials, e-books, and previous years' question papers for most programs."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="p-10">
      <h2 className="text-[31px] leading-[31px] font-semibold font-poppins text-black mb-8">
        Frequently Asked Question
      </h2>
      
      <div className="space-y-2">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-100">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center py-4 px-5 text-left group"
            >
              <span className="text-[15px] font-semibold text-[#003057] font-poppins pr-8">
                {faq.question}
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
                overflow-hidden transition-all duration-500 ease-in-out delay-150
                ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <p className="px-5 pb-4 text-black font-poppins text-[14px] leading-[25.2px]">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}