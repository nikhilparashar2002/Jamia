'use client';

import { useState } from 'react';
import Image from 'next/image';
import ConsultForm from './ConsultForm';
import dynamic from 'next/dynamic';

const Carousel = dynamic(() => import('@/app/Carousel'), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>,
  ssr: false
});

export function ButtonWithForm({ text }: { text: string }) {
  const [isConsultFormOpen, setIsConsultFormOpen] = useState(false);
  
  return (
    <>
      <button
        className="block text-white bg-orange-500 w-full md:w-auto px-6 py-3 rounded-sm text-center mx-auto mt-6"
        onClick={() => setIsConsultFormOpen(true)}
      >
        {text}
      </button>
      <ConsultForm 
        isOpen={isConsultFormOpen} 
        onClose={() => setIsConsultFormOpen(false)} 
      />
    </>
  );
}

export function CarouselSection() {
  return (
    <section className="mx-auto text-center py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Praised by the media</h2>
      <Carousel
        images={[
          { src: "/a1.png", alt: "Media recognition 1" },
          { src: "/a2.png", alt: "Media recognition 2" },
          { src: "/a3.png", alt: "Media recognition 3" },
          { src: "/a4.png", alt: "Media recognition 4" },
        ]}
      />
    </section>
  );
}
