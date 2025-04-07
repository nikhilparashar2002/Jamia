"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselProps {
  images: { src: string; alt: string }[];
}

export default function Carousel({ images }: CarouselProps) {
  const visibleCount = 3;
  const boxWidth = 100; // px
  const gap = 20; // px gap between boxes
  const containerWidth = visibleCount * (boxWidth + gap) - gap;
  const maxIndex = images.length - visibleCount; // max starting index

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <div style={{ width: `${containerWidth}px` }} className="mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-1000"
        style={{
          gap: `${gap}px`,
          transform: `translateX(-${current * (boxWidth + gap)}px)`,
        }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="flex-shrink-0">
            <Image
              src={img.src}
              alt={img.alt}
              width={boxWidth}
              height={boxWidth}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
