"use client";
import React from "react"; // Added to resolve React.Fragment error
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import ConsultForm from '@/components/ConsultForm';
import LatestContent from "@/components/LatestContent";
import BlogSearch from "@/components/blogSearch";
import { useRouter } from 'next/navigation';

const profile1 = "/profile1.jpg";

// Lazy load carousel component
const Carousel = dynamic(() => import("./Carousel"), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>,
  ssr: false
});


const reviews = [
  {
    text: "I enrolled in the Pharmacy course at Jamia Hamdard University after completing my 12th, and it has been a life-changing experience. The university offers excellent academic resources, practical learning, and the opportunity to participate in cutting-edge research. I am now working in the pharmaceutical industry and feel equipped with the knowledge and skills to make an impact in healthcare. Jamia Hamdard has truly helped me shape my career path.",
    profilePic: 'https://res.cloudinary.com/daqz7xu3l/image/upload/v1742534076/seo-content/asset/gmxvkx1dhyobj8t5p5n2.jpg', // Use an image of the student or a generic one
    name: 'Kanishk Sharma',
    stars: 5,
    designation: 'Pharmaceutical Researcher'
  },
  {
    text: "Choosing to study Computer Science at Jamia Hamdard University was one of the best decisions I made after my 12th. The course is both challenging and rewarding, with professors who are experts in their fields. I gained a deep understanding of software development, artificial intelligence, and data analytics. Today, I am working as a software engineer, and I owe my success to the foundation I built at Jamia Hamdard.",
    profilePic: 'https://res.cloudinary.com/daqz7xu3l/image/upload/v1742534189/seo-content/asset/rdywkvmca7jcdz57y3d6.jpg', // Use an image of the student or a generic one
    name: 'Rahul Kumar',
    stars: 5,
    designation: 'Software Engineer'
  },
  {
    text: "After my 12th, I was unsure about what direction to take, but Jamia Hamdard University's Management course gave me clarity. The university not only provided academic excellence but also helped me develop leadership skills through various extracurricular activities. I am now working as a Business Analyst, and I feel confident in my ability to navigate the corporate world thanks to the solid education I received here.",
    profilePic: 'https://res.cloudinary.com/daqz7xu3l/image/upload/v1742534293/seo-content/asset/kxfsut3feylsr2afvshr.jpg', // Use an image of the student or a generic one
    name: 'Nikhil Verma',
    stars: 5,
    designation: 'Business Analyst'
  }
];


export default function Home() {
  const router = useRouter();
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);

  const handleTagSearch = (tag: string) => {
    router.push(`/blog/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="mt-12 bg-gradient-to-r from-blue-800 to-indigo-900 p-8 rounded-lg shadow-2xl">
  <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-12">
    {/* Content Section */}
    <div className="w-full md:w-1/2 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white mb-6 transition duration-300 ease-in-out transform hover:text-blue-600">
          Jamia Hamdard University
        </h1>
       
        
        {/* BlogSearch Component (Add the component as needed) */}
        <BlogSearch />
        
        <p className="text-lg font-semibold text-white mb-6 transition duration-300 ease-in-out transform hover:text-green-600">
          Ranked among the Top 10 Universities in India.
        </p>
      </div>

      {/* University Logos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="flex justify-center items-center transition duration-300 ease-in-out transform hover:scale-110">
          <img src="a1.png" alt="University 1 Logo" className="w-12 h-12 object-contain transition duration-300 ease-in-out transform hover:rotate-12" />
        </div>
        <div className="flex justify-center items-center transition duration-300 ease-in-out transform hover:scale-110">
          <img src="a2.png" alt="University 2 Logo" className="w-12 h-12 object-contain transition duration-300 ease-in-out transform hover:rotate-12" />
        </div>
        <div className="flex justify-center items-center transition duration-300 ease-in-out transform hover:scale-110">
          <img src="a3.png" alt="University 3 Logo" className="w-12 h-12 object-contain transition duration-300 ease-in-out transform hover:rotate-12" />
        </div>
      </div>

      <div className="w-full p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Programs Offered</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">BBA</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">BCA</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">B.Com</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">MBA</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">MCA</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg text-center hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105">
          <p className="font-semibold text-gray-800">MA</p>
        </div>
      </div>
    </div>
    </div>
    

    {/* Image Section */}
    <div className="w-full md:w-1/2 relative mb-8 hover:scale-105 transition duration-500">
      <img
        src="j2.png"
        alt="Jamia Hamdard University Campus"
        className="w-full h-full object-cover rounded-lg shadow-xl transition duration-500 ease-in-out hover:brightness-75"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-lg"></div>
    </div>
  </div>
</section>

<LatestContent />


{/* Updated Search Section */}
<section className="bg-gradient-to-r from-blue-100 via-indigo-100 to-green-100 p-8 rounded-lg shadow-xl">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 text-center">
      Jamia Hamdard University: Online Education Excellence
    </h2>
    <div className="space-y-6 text-lg text-gray-700 text-justify">
      <p className="leading-relaxed">
        Jamia Hamdard University, established in 1989, is a renowned institution based in New Delhi, India, offering a robust array of online education programs. The universitys School of Online and Distance Education provides students with the opportunity to pursue undergraduate, postgraduate, and diploma courses in fields such as management, computer applications, health sciences, and engineering. With a focus on academic excellence, the university leverages digital platforms to deliver high-quality learning experiences, ensuring flexibility and accessibility for students across the globe.
      </p>
      <p className="leading-relaxed">
        Jamia Hamdard's online programs are designed to cater to the diverse needs of working professionals, aspiring students, and those who prefer remote learning. The university provides a well-structured curriculum, interactive learning materials, and expert faculty to guide students through their academic journey. With an emphasis on practical knowledge and industry relevance, Jamia Hamdard strives to equip students with the skills needed to excel in todays competitive job market. Through its innovative approach to education, Jamia Hamdard University remains committed to empowering learners and fostering a strong educational community, making quality education accessible to all.
      </p>
    </div>
  </div>
</section>


<section className="bg-white p-8 rounded-lg shadow-xl">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 text-center">
      Key Highlights of Jamia Hamdard University
    </h2>

    {/* Table of Key Highlights */}
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
  <table className="min-w-full table-auto text-gray-700">
    <thead>
      <tr className="bg-indigo-200 text-gray-800">
        <th className="py-3 px-6 text-left">Attribute</th>
        <th className="py-3 px-6 text-left">Information</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Institution</td>
        <td className="py-3 px-6">Jamia Hamdard Online Education</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Accrediting Body</td>
        <td className="py-3 px-6">NAAC A+ Grade</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Official Recognition</td>
        <td className="py-3 px-6">Approved by UGC-DEB</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Campus Location</td>
        <td className="py-3 px-6">Located in New Delhi</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Year of Foundation</td>
        <td className="py-3 px-6">Founded in 1989</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Offered Programs</td>
        <td className="py-3 px-6">Bachelor's and Master's Degrees</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Key Focus</td>
        <td className="py-3 px-6">Career-Oriented Education</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Specialized Areas</td>
        <td className="py-3 px-6">Emphasis on Education, Healthcare, and Service Sectors</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Approach to Learning</td>
        <td className="py-3 px-6">Focused on Tech-Enhanced Learning</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Development Areas</td>
        <td className="py-3 px-6">Student Growth and Academic Achievement</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Learning Environment</td>
        <td className="py-3 px-6">Highly Intuitive Learning Management System</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Support System</td>
        <td className="py-3 px-6">Career Counseling, Placement Support, and Dedicated Staff</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Application Procedure</td>
        <td className="py-3 px-6">Streamlined Online Admission Process</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">National Rank</td>
        <td className="py-3 px-6">Ranked 40th in NIRF</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50">
        <td className="py-3 px-6 font-semibold">Student Feedback</td>
        <td className="py-3 px-6">Rated 4.5/5 Stars by Students</td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
</section>

     {/* Value Proposition Section */}
<section className="w-full py-16 bg-gradient-to-r from-indigo-100 to-indigo-300 text-center px-6">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
      Unlocking Your <span className="text-green-700">Future</span> with <span className="text-red-700">Jamia Hamdard</span>
    </h2>
    <p className="text-lg sm:text-xl text-black mt-4">
      Explore endless opportunities for growth, learning, and innovation at <span className="text-red-700">Jamia Hamdard University</span>. 🎓✨
    </p>
  </div>
</section>

{/*  */}
<div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
  <h1 className="text-4xl font-bold p-5 text-center">Why Jamia Hamdard University is best?</h1>
  <table className="min-w-full table-auto text-gray-800">
    <thead>
      <tr className="bg-indigo-600 text-white">
        <th className="py-4 px-8 text-left text-lg font-semibold">Features</th>
        <th className="py-4 px-8 text-left text-lg font-semibold">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Top-Notch Reputation</td>
        <td className="py-4 px-8 text-gray-700">Jamia Hamdard University is well-respected for its quality education and research. It is recognized as one of the top institutions in the academic community.</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Affordable Tuition</td>
        <td className="py-4 px-8 text-gray-700">The online courses offered by Jamia Hamdard are reasonably priced. This helps students from different backgrounds, especially those with financial difficulties, to get access to quality education.</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Experienced Faculty</td>
        <td className="py-4 px-8 text-gray-700">The professors at Jamia Hamdard have a strong background in both academics and industry experience. This gives students the best preparation for facing real-life challenges in their careers.</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Industry-Focused Courses</td>
        <td className="py-4 px-8 text-gray-700">The online courses are designed to meet the needs of today's job market. They mix theoretical knowledge with practical skills, ensuring that students are ready for the professional world.</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Wide Range of Programs</td>
        <td className="py-4 px-8 text-gray-700">Jamia Hamdard offers many different types of programs including undergraduate, postgraduate, diploma, and certificate courses. This variety helps students choose the path that suits their career goals.</td>
      </tr>
      <tr className="border-b hover:bg-indigo-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-indigo-700">Job Placement Support</td>
        <td className="py-4 px-8 text-gray-700">The university provides strong job placement assistance, helping students connect with top companies. It also offers skill development programs to boost employability.</td>
      </tr>
    </tbody>
  </table>

  <div className="flex flex-wrap justify-center gap-4 mt-4">
    <button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-6 py-3 bg-white border-blue-700 text-black hover:bg-[#4338CA] text-lg font-semibold rounded-full transition-all duration-300 shadow-md"
    >
      Let's Start Your Journey
    </button>
    
    <button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-6 py-3 border-2 bg-violet-400 border-[#4338CA] text-black text-lg font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Talk to Expert
    </button>
  </div>
</div>


{/*-----------------------------n--------------- */}

<div className="overflow-x-auto bg-gradient-to-r from-indigo-100 to-indigo-300 rounded-lg shadow-lg p-6">
<h1 className="text-4xl font-bold p-5 text-center">Why Should You Choose Jamia Hamdard University?</h1>
  <table className="min-w-full table-auto text-gray-800">
    <thead>
      <tr className="bg-[#4338CA] text-white">
        <th className="py-4 px-8 text-left text-lg font-semibold">Parameter</th>
        <th className="py-4 px-8 text-left text-lg font-semibold">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Proctored Online Exams</td>
        <td className="py-4 px-8 text-gray-700">Exams are held online with real-time monitoring through a webcam and special software to make sure everything stays fair and secure.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Live Monitoring</td>
        <td className="py-4 px-8 text-gray-700">Students are watched throughout the exam to prevent cheating and ensure a fair experience for everyone.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Accessible Anywhere</td>
        <td className="py-4 px-8 text-gray-700">The exams can be taken from any location, as long as you have an internet connection and access to the university's online platform.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Time Limits</td>
        <td className="py-4 px-8 text-gray-700">Each exam has a set time limit, helping students manage their time and complete the exam within the given period.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Clear Instructions</td>
        <td className="py-4 px-8 text-gray-700">Complete guidelines are provided in advance to help students prepare and navigate the exam with confidence.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Ongoing Assessments</td>
        <td className="py-4 px-8 text-gray-700">Along with exams, quizzes, assignments, and projects also contribute to your overall grade throughout the course.</td>
      </tr>
      <tr className="border-b hover:bg-green-50 transition-all duration-300">
        <td className="py-4 px-8 font-semibold text-green-700">Advanced Schedule</td>
        <td className="py-4 px-8 text-gray-700">A detailed exam schedule is released early so you can plan your studies and avoid any overlapping with other commitments.</td>
      </tr>
    </tbody>
  </table>
</div>

{/*  --------------------------         */}
<div className="bg-white rounded-lg shadow-lg p-6">
  <h1 className="text-4xl font-bold p-5 text-center">Jamia Hamdard Online University Academic Approach</h1>
  <p className="text-gray-700 text-lg mb-6">
    Jamia Hamdard Online University, a part of the esteemed Jamia Hamdard, focuses on a student-centered and industry-oriented academic approach. Here are the key features of their approach:
  </p>

  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-xl font-bold text-black mb-4">Experiential Metrics</h3>
    <ul className="list-disc pl-5 text-gray-700 space-y-3">
      <li>
        <strong className="font-medium text-black">Real-world Projects:</strong> Students engage in practical projects that replicate real-world challenges, helping them apply theoretical knowledge to real-life situations.
      </li>
      <li>
        <strong className="font-medium text-black">Industry-Academia Partnership Cell:</strong> This connects students with industry professionals to improve placement chances and prepare them for future careers.
      </li>
      <li>
        <strong className="font-medium text-black">Accessible Online Learning:</strong> A user-friendly online platform gives students access to lectures, course materials, and assessments, ensuring learning is convenient and accessible from anywhere.
      </li>
      <li>
        <strong className="font-medium text-black">Skill Enhancement:</strong> The focus is on developing practical skills that are directly relevant to the job market, ensuring students graduate ready for the workforce.
      </li>
    </ul>
  </div>

  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-black mb-4">Quantitative Metrics</h3>
    <ul className="list-disc pl-5 text-gray-700 space-y-3">
      <li>
        <strong className="font-medium text-black">40th NIRF Ranking:</strong> The university is ranked 40th among the best universities in India by NIRF, demonstrating its commitment to academic excellence and overall development.
      </li>
      <li>
        <strong className="font-medium text-black">35+ Years of Trust:</strong> With over 35 years of educational experience, Jamia Hamdard has built a strong legacy, earning the trust of students, parents, and industries alike.
      </li>
    </ul>
  </div>
</div>

{/* --------------------------  */}
<div className="flex flex-col md:flex-row bg-gradient-to-r from-indigo-100 to-indigo-300 p-6 rounded-lg shadow-lg">

  <div className="md:w-1/2 p-6 space-y-4">
    <h2 className="text-4xl font-bold p-5 text-center">What More Than Just A Degree?</h2>
    <p className="text-lg text-gray-700">
      Jamia Hamdard University provides an online degree, it's a meaningful investment in your future that promotes both personal and professional growth while offering a wealth of opportunities. By selecting Jamia Hamdard Online University, you acquire essential knowledge and develop the skills and mindset necessary to succeed.
    </p>

    <ul className="list-disc pl-5 text-gray-700 space-y-3">
      <li><strong className="font-medium text-indigo-600">UGC Approved:</strong> Degrees recognized by the UGC for credibility.</li>
      <li><strong className="font-medium text-indigo-600">Globally Valued:</strong> Degrees esteemed by employers worldwide, opening international career paths.</li>
      <li><strong className="font-medium text-indigo-600">Relevant Curriculum:</strong> Practical and relevant skills to meet industry demands for job readiness.</li>
      <li><strong className="font-medium text-indigo-600">Equivalent to Jamia On-Campus Degrees:</strong> Jamia Hamdard online degrees offer equal value as on-campus degrees.</li>
    </ul>
    <div className="flex justify-center items-center"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-[#4338CA] text-[#4338CA] text-lg font-semibold rounded-full hover:bg-[#4338CA] hover:text-white transition-all duration-300 shadow-md"
    >
      Get Details
    </button></div>
  </div>

  
  <div className="md:w-1/2 p-6 flex justify-center items-center">
    <img src="cer.png" alt="Certificate Image" className="rounded-lg shadow-lg max-w-[45%] h-auto object-contain" />
  </div>
</div>

{/* --------------Admission Process -------------------------    */}
<div className="bg-white p-8 rounded-lg shadow-xl max-w-full mx-auto">
  <h2 className="text-4xl font-bold p-5 text-center">
    How to Apply to Jamia Hamdard Online University?
  </h2>
  <p className="text-lg text-gray-700 mb-6 text-center">
    The admission process at Jamia Hamdard University is simple and straightforward. Just follow the steps below to apply for our online degree programs. Start your journey towards success with ease!
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          1
        </div>
        <div className="font-semibold text-indigo-700">
          <h3 className="text-2xl font-bold">Submit Form:</h3>
          <p className="mt-3 text-black">Fill in and submit your application form online.</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          2
        </div>
        <div className="font-semibold text-indigo-700">
          <h3 className="text-2xl font-bold">Expert's Counseling:</h3>
          <p className="mt-3 text-black">You will receive a call from our expert counselor to guide you.</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          3
        </div>
        <div className="font-semibold text-indigo-700">
          <h3 className="text-2xl font-bold">Choose University:</h3>
          <p className="mt-3 text-black">Select the course and university based on your interests.</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          4
        </div>
        <div className="font-semibold text-indigo-700">
          <h3 className="text-2xl font-bold">Online Payment:</h3>
          <p className="mt-3 text-black">Complete the smooth online fee submission process.</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          5
        </div>
        <div className="font-semibold text-indigo-700">
         <h3 className="text-2xl font-bold">Document Submit:</h3>
          <p className="mt-3 text-black">Upload your documents and get an admission confirmation sent to your email.</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 border-l-4 border-indigo-500 hover:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg">
          6
        </div>
        <div className="font-semibold text-indigo-700">
          <h3 className="text-2xl font-bold">Admission Confirm:</h3>
          <p className="mt-3 text-black">Get final confirmation via email and WhatsApp.</p>
        </div>
      </div>
    </div>
  </div>
</div>


{/* --------------------------------------------------------------- */}
<div className="overflow-x-auto bg-gradient-to-r from-indigo-200 to-indigo-400
 p-8">
  <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center">
    Check Out Top Online Universities for Admission 2025
  </h2>

  <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
    <thead className="bg-indigo-600 text-white">
      <tr>
        <th className="py-3 px-6 text-left">University</th>
        <th className="py-3 px-6 text-left">Location</th>
        <th className="py-3 px-6 text-left">Approvals & Accreditation</th>
        <th className="py-3 px-6 text-left">Advantage</th>
        <th className="py-3 px-6 text-left">Action</th>
      </tr>
    </thead>
    <tbody className="text-gray-700">
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Manipal University</td>
        <td className="py-4 px-6">Jaipur, Rajasthan</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Certification Access</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Amity University</td>
        <td className="py-4 px-6">Noida, Uttar Pradesh</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Industry Mentorship</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Lovely Professional University</td>
        <td className="py-4 px-6">Phagwara, Punjab</td>
        <td className="py-4 px-6">UGC | NAAC A++</td>
        <td className="py-4 px-6">Virtual Job Fair</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Chandigarh University</td>
        <td className="py-4 px-6">Ajitgarh, Punjab</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Harvard Certifications</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">DY Patil University</td>
        <td className="py-4 px-6">Pune, Maharashtra</td>
        <td className="py-4 px-6">UGC | NAAC A++</td>
        <td className="py-4 px-6">Certification with NYU</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Vivekananda Global University</td>
        <td className="py-4 px-6">Jaipur, Rajasthan</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Certifications from EXIN</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Shoolini University</td>
        <td className="py-4 px-6">Solan, Himachal Pradesh</td>
        <td className="py-4 px-6">UGC | NIRF</td>
        <td className="py-4 px-6">Pay After Placement</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Sharda University</td>
        <td className="py-4 px-6">Greater Noida, Uttar Pradesh</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Renowned University</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Jain University</td>
        <td className="py-4 px-6">Bangalore, Karnataka</td>
        <td className="py-4 px-6">UGC | NAAC A++</td>
        <td className="py-4 px-6">LinkedIn Courses Access</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Sikkim Manipal University</td>
        <td className="py-4 px-6">Gangtok, Sikkim</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Scholarship Opportunity</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Vignan University</td>
        <td className="py-4 px-6">Guntur, Andhra Pradesh</td>
        <td className="py-4 px-6">UGC | NAAC A+</td>
        <td className="py-4 px-6">Advanced Certification</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">UPES University</td>
        <td className="py-4 px-6">Dehradun, Uttarakhand</td>
        <td className="py-4 px-6">UGC | NAAC A</td>
        <td className="py-4 px-6">Oil, Gas & Power</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Amrita University</td>
        <td className="py-4 px-6">Coimbatore, Tamil Nadu</td>
        <td className="py-4 px-6">UGC | NAAC A++</td>
        <td className="py-4 px-6">Certification Training</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
      <tr className="border-b">
        <td className="py-4 px-6 font-semibold">Shobhit University</td>
        <td className="py-4 px-6">Meerut, Uttar Pradesh</td>
        <td className="py-4 px-6">UGC | NAAC A</td>
        <td className="py-4 px-6">Affordable Fee</td>
        <td className="py-4 px-6"><button 
      onClick={() => setIsConsultFormOpen(true)}
      className="px-4 py-3 border-2 border-green-500 text-green-500 text-lg font-semibold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-md"
    >
      Download Brochure
    </button></td>
      </tr>
    </tbody>
  </table>
</div>




{/* ----------------------------------------------------------------------------------------------------------------*/}





 {/* Latest Content Section */}




{/*--------------------------------------------------------------------------------------------------------------*/}


<section className="w-full py-16 bg-gradient-to-r from-blue-800 to-indigo-900">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h1 className="text-4xl font-bold text-white mb-4">
      Students are <span className="text-teal-400">Loving Us</span>
    </h1>

    {/* Star Rating */}
    <div className="text-yellow-400 text-7xl mb-6">★★★★★</div>

    {/* Reviews Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <p className="text-gray-700 italic">"{review.text}"</p>
          
          {/* Reviewer Info */}
          <div className="flex items-center gap-4 mt-4">
            <Image
              src={review.profilePic}
              alt={`${review.name} profile`}
              width={50}
              height={50}
              className="rounded-full border-2 border-teal-500"
            />
            <div className="text-left">
              <strong className="text-gray-900">{review.name}</strong>
              <div className="text-yellow-400 text-sm">★★★★★</div>
              <span className="text-gray-500 text-sm">{review.designation}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>





{/* -----------------------------------------------------------------------------------/}
      {/* Media Section 
      <section className="w-full bg-purple-400 py-4">
        <Image
          src="/b1.png"
          alt="Our achievements and recognition"
          width={1200}
          height={800}
          className="mx-auto block max-w-full"
          loading="lazy"
        />
      </section> */}

      <section>
      <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-4xl font-extrabold text-blue-600">5000+</h3>
            <p className="text-lg font-medium text-gray-700">Happy Students</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-5xl font-extrabold text-green-600">100+</h3>
            <p className="text-lg font-medium text-gray-700">Approved Courses</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-5xl font-extrabold text-red-600">500+</h3>
            <p className="text-lg font-medium text-gray-700">Certified Teachers</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-4xl font-extrabold text-purple-600">10000+</h3>
            <p className="text-lg font-medium text-gray-700">Graduate Students</p>
          </div>
        </div>
      </div>
    </div>
      </section>

      {/* Media Praise Section */}
      <ConsultForm 
        isOpen={isConsultFormOpen} 
        onClose={() => setIsConsultFormOpen(false)} 
      />
    </main>
  );
}
