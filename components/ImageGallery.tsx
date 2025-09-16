'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  columns?: number;
  gap?: number;
}

export default function ImageGallery({ 
  images, 
  columns = 3, 
  gap = 4 
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setZoom(1);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setZoom(1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setZoom(1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* 画廊网格 */}
      <div 
        className={`grid gap-${gap}`}
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)` 
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            onClick={() => openLightbox(index)}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* 悬停覆盖层 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* 图片说明 */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 灯箱模态框 */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* 关闭按钮 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="关闭"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 控制按钮 */}
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              disabled={zoom <= 0.5}
              aria-label="缩小"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              disabled={zoom >= 3}
              aria-label="放大"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>

          {/* 导航按钮 */}
          {selectedIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="上一张"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              aria-label="下一张"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* 图片容器 */}
          <div className="flex items-center justify-center h-full p-8">
            <div 
              className="relative max-w-full max-h-full transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              <OptimizedImage
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
              
              {/* 图片说明 */}
              {images[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white text-lg font-medium text-center">
                    {images[selectedIndex].caption}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 图片计数器 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black/50 rounded-full px-4 py-2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}