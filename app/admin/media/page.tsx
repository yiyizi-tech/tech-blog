'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Music,
  Trash2, 
  Download, 
  Eye,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { AlertModal, ConfirmModal } from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

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

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const modal = useModal();

  // 获取媒体文件列表
  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await fetch(`/api/media?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data.mediaFiles);
      } else {
        modal.error('错误', '获取媒体文件失败');
      }
    } catch (error) {
      console.error('获取媒体文件失败:', error);
      modal.error('错误', '获取媒体文件失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, [searchTerm, filterType]);

  // 文件上传
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          modal.error('上传失败', error.error || '文件上传失败');
          continue;
        }
      }
      
      modal.success('成功', '文件上传成功');
      fetchMediaFiles(); // 刷新列表
    } catch (error) {
      console.error('文件上传失败:', error);
      modal.error('错误', '文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 获取文件类型
  const getFileType = (mimetype: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const filteredItems = mediaItems;

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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await modal.confirm('确定要删除这个文件吗？此操作不可恢复。', '确认删除');
    if (confirmed) {
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setMediaItems(prev => prev.filter(item => item.id !== id));
          setSelectedItems(prev => prev.filter(itemId => itemId !== id));
          modal.success('成功', '文件删除成功！');
        } else {
          const error = await response.json();
          modal.error('删除失败', error.error || '文件删除失败');
        }
      } catch (error) {
        console.error('删除文件失败:', error);
        modal.error('错误', '文件删除失败');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      modal.error('提示', '请先选择要删除的文件');
      return;
    }

    const confirmed = await modal.confirm(`确定要删除选中的 ${selectedItems.length} 个文件吗？此操作不可恢复。`, '批量删除');
    if (confirmed) {
      try {
        const deletePromises = selectedItems.map(id =>
          fetch(`/api/media/${id}`, { method: 'DELETE' })
        );
        
        await Promise.all(deletePromises);
        
        setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        modal.success('成功', '文件批量删除成功！');
      } catch (error) {
        console.error('批量删除失败:', error);
        modal.error('错误', '批量删除失败');
      }
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">媒体库</h1>
          <p className="mt-1 text-gray-400">管理图片、视频和其他媒体文件</p>
        </div>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            disabled={uploading}
          />
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? '上传中...' : '上传文件'}
        </label>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">总文件数</p>
              <p className="text-2xl font-bold text-white">{mediaItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">图片</p>
              <p className="text-2xl font-bold text-white">{mediaItems.filter(i => getFileType(i.mimetype) === 'image').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">视频</p>
              <p className="text-2xl font-bold text-white">{mediaItems.filter(i => getFileType(i.mimetype) === 'video').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">文档</p>
              <p className="text-2xl font-bold text-white">{mediaItems.filter(i => getFileType(i.mimetype) === 'document').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索文件..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
                <option value="audio">音频</option>
                <option value="document">文档</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">
                  已选择 {selectedItems.length} 个文件
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  批量删除
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-400 hover:text-white cursor-pointer"
                >
                  取消选择
                </button>
              </div>
            )}
            
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
      </div>

      {/* 媒体文件展示 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer ${
                selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleSelectItem(item.id)}
            >
              <div className="aspect-square mb-3 bg-gray-700 rounded-lg flex items-center justify-center">
                {getFileType(item.mimetype) === 'image' ? (
                  <img src={item.url} alt={item.alt || item.originalName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-gray-400">
                    {getFileIcon(getFileType(item.mimetype))}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-white truncate" title={item.originalName}>
                  {item.originalName}
                </h3>
                <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
              </div>
              
              <div className="mt-3 flex items-center space-x-2">
                <button
                  className="text-blue-400 hover:text-blue-300 cursor-pointer"
                  title="预览"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  className="text-green-400 hover:text-green-300 cursor-pointer"
                  title="下载"
                >
                  <Download className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                  title="删除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                    className="rounded border-gray-600 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  文件
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  大小
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  上传时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="rounded border-gray-600 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-3">
                        {getFileIcon(getFileType(item.mimetype))}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.originalName}</div>
                        {item.alt && (
                          <div className="text-sm text-gray-400">{item.alt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 capitalize">
                    {getFileType(item.mimetype)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300 cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="text-white">加载中...</div>
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-white">暂无媒体文件</h3>
          <p className="mt-1 text-sm text-gray-400">
            {searchTerm || filterType !== 'all' ? '没有找到匹配的文件' : '开始上传你的第一个文件'}
          </p>
          {!searchTerm && filterType === 'all' && (
            <div className="mt-6">
              <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                <Plus className="w-4 h-4 mr-2" />
                上传文件
              </label>
            </div>
          )}
        </div>
      )}

      {/* 模态框 */}
      <AlertModal
        isOpen={modal.alertModal.isOpen}
        onClose={modal.closeAlert}
        type={modal.alertModal.options?.type || 'info'}
        title={modal.alertModal.options?.title || ''}
        message={modal.alertModal.options?.message || ''}
      />
      
      <ConfirmModal
        isOpen={modal.confirmModal.isOpen}
        onClose={() => modal.closeConfirm(false)}
        onConfirm={() => modal.closeConfirm(true)}
        title={modal.confirmModal.options?.title || ''}
        message={modal.confirmModal.options?.message || ''}
        confirmText={modal.confirmModal.options?.confirmText}
        cancelText={modal.confirmModal.options?.cancelText}
        type={modal.confirmModal.options?.type}
      />
    </div>
  );
}