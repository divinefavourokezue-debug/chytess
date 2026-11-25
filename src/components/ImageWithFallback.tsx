import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF3E3] to-[#F3E2BA] text-[#7A4E4E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="w-7 h-7 stroke-[1.25] mb-2 opacity-60" />
        <span className="text-xs tracking-wide uppercase font-medium opacity-75 line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
