import Image from 'next/image';
import { FC } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const OptimizedImage: FC<OptimizedImageProps> = ({ src, alt, width = 800, height = 600, className = '' }) => (
  <div className={`relative ${className}`}>
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-lg shadow-lg object-contain"
      priority // For above-the-fold images
    />
    <p className="text-center text-sm text-gray-600 mt-2 italic">{alt}</p>
  </div>
);

export default OptimizedImage;
