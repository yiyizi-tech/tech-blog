'use client';

import { useState, useEffect } from 'react';
import { parseTags } from '@/lib/tags';
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Calendar,
  Tag,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { AlertModal, ConfirmModal } from '../Modal';
import { useModal } from '../../hooks/useModal';

// 文章数据类型
interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  createdAt: string;
  author: string | null;
  tags: string; // JSON string representation of tags array
  published: boolean;
  views: number;
  readingTime: number;
}

export default function PostsManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const modal = useModal();
  const articlesPerPage = 10;

  // 获取文章数据
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?page=1&limit=1000');
      const data = await response.json();
      
      if (response.ok) {
        setArticles(data.posts);
      } else {
        console.error('获取文章失败:', data.error);
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤文章
  useEffect(() => {
    let filtered = articles;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        parseTags(article.tags).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      if (statusFilter === 'published') {
        filtered = filtered.filter(article => article.published);
      } else if (statusFilter === 'draft') {
        filtered = filtered.filter(article => !article.published);
      }
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchTerm, statusFilter]);

  // 分页
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  // 删除文章
  const handleDeleteArticle = async (id: number) => {
    const confirmed = await modal.confirm('确定要删除这篇文章吗？此操作不可恢复。', '确认删除');
    if (confirmed) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setArticles(articles.filter(article => article.id !== id));
          setSelectedArticles(selectedArticles.filter(selectedId => selectedId !== id));
        } else {
          modal.error('删除失败', '请重试');
        }
      } catch (error) {
        console.error('删除文章失败:', error);
        modal.error('删除失败', '请重试');
      }
    }
  };

  // 批量删除
  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) {
      modal.error('提示', '请先选择要删除的文章');
      return;
    }
    
    const confirmed = await modal.confirm(`确定要删除选中的 ${selectedArticles.length} 篇文章吗？此操作不可恢复。`, '批量删除');
    if (confirmed) {
      try {
        const deletePromises = selectedArticles.map(id => 
          fetch(`/api/posts/${id}`, { method: 'DELETE' })
        );
        
        await Promise.all(deletePromises);
        setArticles(articles.filter(article => !selectedArticles.includes(article.id)));
        setSelectedArticles([]);
      } catch (error) {
        console.error('批量删除失败:', error);
        modal.error('批量删除失败', '请重试');
      }
    }
  };

  // 切换文章状态
  const toggleArticleStatus = async (id: number, published: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published }),
      });

      if (response.ok) {
        setArticles(articles.map(article =>
          article.id === id ? { ...article, published } : article
        ));
      } else {
        modal.error('更新状态失败', '请重试');
      }
    } catch (error) {
      console.error('更新文章状态失败:', error);
      modal.error('更新状态失败', '请重试');
    }
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedArticles.length === currentArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(currentArticles.map(article => article.id));
    }
  };

  // 切换单个选择
  const toggleSelectArticle = (id: number) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(articleId => articleId !== id) : [...prev, id]
    );
  };

  // 状态标签样式
  const getStatusBadge = (published: boolean) => {
    if (published) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
          已发布
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
          草稿
        </span>
      );
    }
  };

  return (
    <div>
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">文章管理</h1>
          <p className="mt-1 text-gray-400">管理你的所有博客文章</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">总文章数</p>
                <p className="text-2xl font-semibold text-white">{loading ? '-' : articles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">总浏览量</p>
                <p className="text-2xl font-semibold text-white">
                  {loading ? '-' : articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">P</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">已发布</p>
                <p className="text-2xl font-semibold text-white">
                  {loading ? '-' : articles.filter(a => a.published).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-semibold">D</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">草稿</p>
                <p className="text-2xl font-semibold text-white">
                  {loading ? '-' : articles.filter(a => !a.published).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                {/* 批量操作 */}
                {selectedArticles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">
                      已选择 {selectedArticles.length} 篇文章
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center px-3 py-1.5 border border-red-600/30 text-xs font-medium rounded-md text-red-300 bg-red-900/20 hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      批量删除
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 新建文章按钮 */}
                <Link
                  href="/admin/editor"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建文章
                </Link>
              </div>
            </div>
          </div>

          {/* 搜索和过滤 */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* 搜索框 */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索文章标题、内容或标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  />
                </div>

                {/* 状态过滤器 */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                    className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors"
                  >
                    <option value="all">所有状态</option>
                    <option value="published">已发布</option>
                    <option value="draft">草稿</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 文章列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === currentArticles.length && currentArticles.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    文章信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    统计
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      加载中...
                    </td>
                  </tr>
                ) : currentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleSelectArticle(article.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {article.excerpt || '暂无摘要'}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 mt-2">
                            {parseTags(article.tags).slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-600/30"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {parseTags(article.tags).length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-400">
                                +{parseTags(article.tags).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(article.published)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {article.readingTime}分钟
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(article.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-start space-x-3">
                        {/* 发布状态操作按钮 */}
                        {!article.published ? (
                          <button
                            onClick={() => toggleArticleStatus(article.id, true)}
                            className="p-1 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded transition-colors cursor-pointer"
                            title="发布文章"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleArticleStatus(article.id, false)}
                            className="p-1 text-orange-400 hover:text-orange-300 hover:bg-orange-900/20 rounded transition-colors cursor-pointer"
                            title="取消发布"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/editor?id=${article.id}`}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                            title="编辑文章"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/posts/${article.slug}${article.published ? '' : '?preview=true'}`}
                            className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors"
                            title="预览文章"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                            title="删除文章"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  显示第 <span className="font-medium text-white">{startIndex + 1}</span> 到{' '}
                  <span className="font-medium text-white">
                    {Math.min(startIndex + articlesPerPage, filteredArticles.length)}
                  </span>{' '}
                  条，共 <span className="font-medium text-white">{filteredArticles.length}</span> 条结果
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* 空状态 */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-white">暂无文章</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? '没有找到匹配的文章，请调整搜索条件或过滤器。'
                  : '开始创建你的第一篇博客文章吧！'
                }
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/editor"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建文章
                </Link>
              </div>
            </div>
          )}
        </div>
        
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