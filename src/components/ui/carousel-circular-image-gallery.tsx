"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageData {
  title: string;
  url: string;
}

const images: ImageData[] = [
  {
    title: "Event 1",
    url: "/WhatsApp Image 2025-11-30 at 13.37.59_863eb326.jpg",
  },
  {
    title: "Event 2",
    url: "/flag.jpg",
  },
  {
    title: "Event 3",
    url: "/WhatsApp Image 2025-11-30 at 13.38.02_a4a80f5a.jpg",
  },
  {
    title: "Event 4",
    url: "/WhatsApp Image 2025-11-30 at 13.38.03_07f2f5cf.jpg",
  },
  {
    title: "Event 5",
    url: "/WhatsApp Image 2025-11-30 at 13.38.03_2229fac9.jpg",
  },
  {
    title: "Event 6",
    url: "/WhatsApp Image 2025-11-30 at 13.38.04_3f13665b.jpg",
  },
  {
    title: "Event 7",
    url: "/WhatsApp Image 2025-11-30 at 13.38.17_e9b68f76.jpg",
  },
];

export function ImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayDelay = 5000; // 5 seconds

  // Function to start autoplay
  const startAutoplay = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, autoplayDelay);
  };

  // Function to stop autoplay
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Also clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Initialize autoplay on mount
  useEffect(() => {
    startAutoplay();
    
    return () => {
      stopAutoplay();
    };
  }, []);

  const goTo = (index: number) => {
    // Stop autoplay when user manually navigates
    stopAutoplay();
    
    // Navigate to the selected image
    if (index < 0) setActiveIndex(images.length - 1);
    else if (index >= images.length) setActiveIndex(0);
    else setActiveIndex(index);
    
    // Restart autoplay after a delay (give user time to browse)
    timeoutRef.current = setTimeout(() => {
      startAutoplay();
      timeoutRef.current = null;
    }, autoplayDelay);
  };

  const current = images[activeIndex];

  return (
    <div className="flex w-full justify-center py-8 font-sans">
      <div className="relative w-full max-w-4xl rounded-[32px] bg-transparent">
        {/* Image container */}
        <div className="relative overflow-hidden rounded-[32px] bg-black shadow-[0_32px_80px_rgba(0,0,0,0.85)]">
          <img
            key={current.url}
            src={current.url}
            alt={current.title}
            className="h-[320px] w-full object-cover md:h-[420px] lg:h-[460px]"
          />

          {/* Arrows (inside container, centered) */}
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous image"
            className="group absolute left-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] outline-none transition-all hover:scale-110 hover:bg-white/95 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/70 md:left-6 md:h-16 md:w-16"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next image"
            className="group absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] outline-none transition-all hover:scale-110 hover:bg-white/95 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/70 md:right-6 md:h-16 md:w-16"
          >
            <ChevronRight className="h-6 w-6 text-gray-800 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="mt-5 flex items-center justify-center gap-3 md:gap-4">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.url}
                type="button"
                onClick={() => goTo(index)}
                aria-label={image.title}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all md:h-11 md:w-11 ${
                  isActive
                    ? "border-primary shadow-[0_0_0_3px_rgba(242,185,13,0.45)]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full rounded-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;

