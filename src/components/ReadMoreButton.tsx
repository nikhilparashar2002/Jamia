"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReadMoreButton({ slug }: { slug: string }) {
  return (
    <Link
      href={`/${slug}`}
      className="flex-1  bg-[#a2781d] hover:bg-[#d0a240] text-white py-2.5 px-4 rounded-md font-medium transition-colors duration-200 text-center flex items-center justify-center gap-2"
    >
      <span>Read More</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M5 12h16" />
      </svg>
    </Link>
  );
}
