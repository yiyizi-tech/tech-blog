'use client';

import { useState, useRef } from 'react';
import { Modal } from './Modal';
import { Upload, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (src: string, alt: string) => void;
}

export default function ImageUploadModal({ isOpen, onClose, onInsertImage }: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setImageUrl('');
    setAltText('');
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    setActiveTab('upload');
    onClose();
  };

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onInsertImage(imageUrl.trim(), altText.trim());
      handleClose();
    }
  };

  const handleUploadInsert = () => {
    if (uploadedImageUrl) {
      onInsertImage(uploadedImageUrl, altText.trim());
      handleClose();
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      setUploadProgress(100);
      setUploadedImageUrl(data.url);
    } catch (error) {
      console.error('上传失败:', error);
      alert(error instanceof Error ? error.message : '上传失败，请重试');
      setPreviewUrl(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB限制
      alert('图片大小不能超过 10MB');
      return;
    }

    // 生成预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 真实的文件上传
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="插入图片" size="md" lockBodyScroll={false}>
      <div className="space-y-4">
        {/* 标签页 */}
        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            上传文件
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            <LinkIcon className="w-4 h-4 inline mr-2" />
            网络链接
          </button>
        </div>

        {/* 上传文件标签页 */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* 拖拽上传区域 */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="max-h-32 rounded-lg shadow-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setUploadedImageUrl(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {isUploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="w-12 h-12 text-gray-500 mx-auto" />
                  <div>
                    <p className="text-white font-medium">点击或拖拽图片到此处</p>
                    <p className="text-gray-400 text-sm mt-1">支持 JPG、PNG、GIF，最大 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Alt文本输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                图片描述（可选）
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="输入图片描述..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* 网络链接标签页 */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                图片链接
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                图片描述（可选）
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="输入图片描述..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 预览 */}
            {imageUrl && (
              <div className="border border-gray-600 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">预览：</p>
                <img
                  src={imageUrl}
                  alt={altText || "预览图片"}
                  className="max-h-32 rounded shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 按钮 */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={activeTab === 'upload' ? handleUploadInsert : handleUrlInsert}
            disabled={
              isUploading || 
              (activeTab === 'upload' && !uploadedImageUrl) || 
              (activeTab === 'url' && !imageUrl.trim())
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isUploading ? '上传中...' : '插入图片'}
          </button>
        </div>
      </div>
    </Modal>
  );
}