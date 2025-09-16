'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { compressImage, convertImageFormat } from '@/lib/imageUtils';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  maxSize?: number; // MB
  acceptedFormats?: string[];
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  multiple?: boolean;
  className?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  uploading: boolean;
  error?: string;
}

export default function ImageUpload({
  onUpload,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  compress = true,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
  multiple = false,
  className = ''
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `不支持的文件格式。支持的格式：${acceptedFormats.join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小超过限制（${maxSize}MB）`;
    }
    
    return null;
  };

  const processImage = async (file: File): Promise<File> => {
    if (!compress) return file;
    
    try {
      const compressedBlob = await compressImage(file, maxWidth, maxHeight, quality);
      return new File([compressedBlob], file.name, { type: 'image/jpeg' });
    } catch (error) {
      console.warn('图片压缩失败，使用原文件:', error);
      return file;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        alert(error);
        continue;
      }

      const imageId = Math.random().toString(36).substr(2, 9);
      const previewUrl = URL.createObjectURL(file);
      
      const newImage: UploadedImage = {
        id: imageId,
        file,
        url: previewUrl,
        uploading: true
      };

      setImages(prev => multiple ? [...prev, newImage] : [newImage]);

      try {
        const processedFile = await processImage(file);
        const uploadedUrl = await onUpload(processedFile);
        
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, url: uploadedUrl, uploading: false }
            : img
        ));
      } catch (error) {
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, uploading: false, error: error instanceof Error ? error.message : '上传失败' }
            : img
        ));
      }
    }
  }, [onUpload, multiple, maxSize, acceptedFormats, compress, maxWidth, maxHeight, quality]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // 重置input值，允许选择相同文件
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = (id: string) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach(img => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
  };

  return (
    <div className={className}>
      {/* 上传区域 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isDragging ? '释放文件以上传' : '点击或拖拽图片到此处'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              支持 {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} 格式，
              最大 {maxSize}MB
            </p>
            {compress && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                图片将自动压缩至 {maxWidth}x{maxHeight} 以优化性能
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              已选择的图片 ({images.length})
            </h3>
            {images.length > 1 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                清空全部
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt="预览"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 上传状态覆盖层 */}
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* 错误状态 */}
                  {image.error && (
                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                      <div className="text-white text-center p-2">
                        <X className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">{image.error}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* 文件信息 */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p className="truncate">{image.file.name}</p>
                  <p>{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}