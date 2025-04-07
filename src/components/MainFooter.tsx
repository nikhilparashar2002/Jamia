"use client";

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import ConsultForm from './ConsultForm';
import Link from 'next/link';


export default function MainFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  {/*const footerCourses = [
    {
      "title": "Law Courses After 12th",
      "slug": "law-courses-after-12th"
    },
    {
      "title": "Ethical Hacking Courses After 12th",
      "slug": "ethical-hacking-courses-after-12th"
    },
    {
      "title": "Actuarial Science After 12th Course",
      "slug": "actuarial-science-after-12th-course"
    },
    {
      "title": "Animation Courses After 12th",
      "slug": "animation-courses-after-12th"
    },
    {
      "title": "Biotechnology Courses After 12th",
      "slug": "biotechnology-courses-after-12th"
    },
    {
      "title": "Banking Courses After 12th",
      "slug": "banking-courses-after-12th"
    },
    {
      "title": "B.Sc Courses After 12th",
      "slug": "b-sc-courses-after-12th"
    },
    {
      "title": "Business Management courses after 12th",
      "slug": "business-management-courses-after-12th"
    },
    {
      "title": "Cloud Computing courses after 12th",
      "slug": "cloud-computing-courses-after-12th"
    },
    {
      "title": "Computer Science courses after 12th",
      "slug": "computer-science-courses-after-12th"
    },
    {
      "title": "Cybersecurity Courses After 12th",
      "slug": "cybersecurity-courses-after-12th"
    },
    {
      "title": "Data Science Course After 12th",
      "slug": "data-science-course-after-12th"
    },
    {
      "title": "Degree Courses After 12th",
      "slug": "degree-courses-after-12th"
    },
    {
      "title": "Diploma Courses After 12th",
      "slug": "diploma-courses-after-12th"
    },
    {
      "title": "Engineering Courses After 12th",
      "slug": "engineering-courses-after-12th"
    },
    {
      "title": "Environmental Course After 12th",
      "slug": "environmental-course-after-12th"
    },
    {
      "title": "Digital Marketing Course After 12th",
      "slug": "digital-marketing-course-after-12th"
    },
    {
      "title": "Best Courses After 12th",
      "slug": "best-courses-after-12th-admission-eligibility-fees"
    },
    {
      "title": "Language Courses After 12th",
      "slug": "language-courses-after-12th"
    },
    {
      "title": "Event Management Courses After 12th",
      "slug": "event-management-courses-after-12th"
    },
    {
      "title": "Graphic Design Courses After 12th",
      "slug": "graphic-design-courses-after-12th"
    },
    {
      "title": "Interior Designing Courses After 12th",
      "slug": "interior-designing-courses-after-12th"
    },
    {
      "title": "Mass Communication Courses After 12th",
      "slug": "mass-communication-courses-after-12th"
    },
    {
      "title": "Nursing Courses After 12th",
      "slug": "nursing-courses-after-12th"
    },
    {
      "title": "Medical Courses After 12th",
      "slug": "medical-courses-after-12th"
    },
    {
      "title": "Paramedical Courses After 12th",
      "slug": "paramedical-courses-after-12th"
    },
    {
      "title": "Pharmacy Courses After 12th",
      "slug": "pharmacy-courses-after-12th"
    },
    {
      "title": "Political Science Courses After 12th",
      "slug": "political-science-courses-after-12th"
    },
    {
      "title": "Sociology Courses After 12th",
      "slug": "sociology-courses-after-12th"
    },
    {
      "title": "Psychology Courses After 12th",
      "slug": "psychology-courses-after-12th"
    },
    {
      "title": "Fine Arts Courses After 12th",
      "slug": "fine-arts-courses-after-12th"
    },
    {
      "title": "Hotel Management Courses After 12th",
      "slug": "hotel-management-courses-after-12th"
    },
    {
      "title": "Photography Courses After 12th",
      "slug": "photography-courses-after-12th"
    },
    {
      "title": "Polytechnic Courses After 12th",
      "slug": "polytechnic-courses-after-12th"
    },
    {
      "title": "Software Engineering Courses After 12th",
      "slug": "software-engineering-courses-after-12th"
    },
    {
      "title": "Tourism & Travel Courses After 12th",
      "slug": "tourism-travel-courses-after-12th"
    },
    {
      "title": "List of After 12th Courses",
      "slug": "list-of-after-12th-courses"
    },
    {
      "title": "Web Development Courses After 12th",
      "slug": "web-development-courses-after-12th"
    },
    {
      "title": "Agriculture Course After 12th",
      "slug": "agriculture-course-after-12th"
    },
    {
      "title": "Short-term Courses After 12th",
      "slug": "short-term-courses-after-12th"
    },
    {
      "title": "Professional Courses After 12th",
      "slug": "professional-courses-after-12th"
    },
    {
      "title": "Artificial Intelligence Courses After 12th",
      "slug": "artificial-intelligence-courses-after-12th"
    },
    {
      "title": "Job-oriented Courses After 12th",
      "slug": "job-oriented-courses-after-12th"
    },
    {
      "title": "Veterinary Courses After 12th",
      "slug": "veterinary-courses-after-12th"
    },
    {
      "title": "ITI Courses After 12th",
      "slug": "iti-courses-after-12th"
    },
    {
      "title": "High-salary Courses After 12th",
      "slug": "high-salary-courses-after-12th"
    },
    {
      "title": "Finance Courses After 12th",
      "slug": "finance-courses-after-12th"
    },
    {
      "title": "Fashion Design Courses After 12th",
      "slug": "fashion-design-courses-after-12th"
    },
    {
      "title": "Stock Market Courses After 12th",
      "slug": "stock-market-courses-after-12th"
    },
    {
      "title": "12th Fail do Graduation Admission",
      "slug": "12th-fail-do-graduation"
    }
  ] */}

  const FooterCourses = () => {
    // Split the courses into 4 equal parts
   {/* const chunkedCourses = Array.from({ length: 4 }, (_, i) => 
      footerCourses.slice(i * Math.ceil(footerCourses.length / 4), (i + 1) * Math.ceil(footerCourses.length / 4))
    ); */}

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-2 mb-2">
        {/* {chunkedCourses.map((chunk, index) => ( 
          <div key={index} className="space-y-2">
            {chunk.map((course, idx) => (
              <div key={idx} className="mb-2">
                <Link href={`https://jamia-chi.vercel.app/${course.slug}`}>
                  <div className="text-white hover:text-yellow-300 text-sm font-normal py-1">
                    {course.title}
                  </div>
                </Link>
              </div>
            ))}
          </div> 
        ))} */}
      </div>
    );
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
      <FooterCourses />
<hr className='m-5' />
        <div className="flex justify-center">
          

          {/* Center Section */}
          <div className="space-y-4">
              
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
                onPress={() => setIsModalOpen(true)}
              >
                Request a call back
              </Button>
            </div>

          
          </div>
      </div>

      {/* Consultation Form Modal */}
      <ConsultForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}