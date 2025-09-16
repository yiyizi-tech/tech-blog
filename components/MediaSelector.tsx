'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Upload, Image as ImageIcon, Search, Grid3X3, List, Check, X } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  alt?: string;
  description?: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaItem: MediaItem) => void;
  selectedUrl?: string;
  title?: string;
}

export default function MediaSelector({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedUrl,
  title = "选择媒体文件"
}: MediaSelectorProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 获取媒体文件列表
  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      params.append('type', 'image'); // 只显示图片
      
      const response = await fetch(`/api/media?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data.mediaFiles || []);
      } else {
        console.error('获取媒体文件失败');
      }
    } catch (error) {
      console.error('获取媒体文件失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMediaFiles();
    }
  }, [isOpen, searchTerm]);

  // 文件上传
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // 只允许图片文件
        if (!file.type.startsWith('image/')) {
          alert('只能上传图片文件');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          alert(error.error || '文件上传失败');
          continue;
        }
      }
      
      fetchMediaFiles(); // 刷新列表
    } catch (error) {
      console.error('文件上传失败:', error);
      alert('文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  const handleSelect = (mediaItem: MediaItem) => {
    onSelect(mediaItem);
    handleClose();
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <div className="space-y-4">
        {/* 操作栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索图片..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                disabled={uploading}
              />
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? '上传中...' : '上传图片'}
            </label>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} cursor-pointer`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} cursor-pointer`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 媒体文件展示 */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">加载中...</div>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-white">暂无图片</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm ? '没有找到匹配的图片' : '开始上传你的第一张图片'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-colors cursor-pointer ${
                    selectedUrl === item.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="aspect-square mb-2 bg-gray-600 rounded-lg overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.alt || item.originalName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedUrl === item.url && (
                    <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-medium text-white truncate" title={item.originalName}>
                      {item.originalName}
                    </h3>
                    <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer ${
                    selectedUrl === item.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-lg overflow-hidden mr-3">
                    <img 
                      src={item.url} 
                      alt={item.alt || item.originalName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{item.originalName}</div>
                    <div className="text-xs text-gray-400">
                      {formatFileSize(item.size)} • {formatDate(item.createdAt)}
                    </div>
                  </div>
                  
                  {selectedUrl === item.url && (
                    <div className="ml-3 bg-blue-600 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            取消
          </button>
        </div>
      </div>
    </Modal>
  );
}