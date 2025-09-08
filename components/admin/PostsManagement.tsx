'use client';

import { useState, useEffect } from 'react';
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
import AdminLayout from './AdminLayout';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';

// 文章数据类型
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  views: number;
  readingTime: number;
}

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: 'nextjs-15-complete-guide',
    title: 'Next.js 15 完整指南：从入门到精通',
    excerpt: '学习如何使用最新版本的 Next.js 构建现代化 Web 应用程序及其新功能。',
    content: '# Next.js 15 完整指南\n\nNext.js 15 带来了许多革命性的特性...',
    date: '2024-09-05',
    author: 'Xu Liang',
    tags: ['Next.js', 'React', 'Web 开发'],
    status: 'published',
    views: 1250,
    readingTime: 8
  },
  {
    id: 'typescript-advanced-patterns',
    title: 'TypeScript 高级模式与最佳实践',
    excerpt: '编写更好、更可维护代码的 TypeScript 模式和实践。',
    content: '# TypeScript 高级模式\n\nTypeScript 提供了强大的类型系统...',
    date: '2024-09-03',
    author: 'Xu Liang',
    tags: ['TypeScript', 'JavaScript', '最佳实践'],
    status: 'published',
    views: 890,
    readingTime: 6
  },
  {
    id: 'tailwind-css-tips',
    title: 'Tailwind CSS 技巧',
    excerpt: '在项目中有效使用 Tailwind CSS 的高级技术和技巧。',
    content: '# Tailwind CSS 技巧\n\nTailwind CSS 是一个实用优先的 CSS 框架...',
    date: '2024-09-01',
    author: 'Xu Liang',
    tags: ['Tailwind CSS', 'CSS', '前端'],
    status: 'published',
    views: 654,
    readingTime: 4
  },
  {
    id: 'draft-article',
    title: 'React 18 新特性深度解析',
    excerpt: '深入了解 React 18 带来的并发特性、自动批处理等新功能。',
    content: '# React 18 新特性\n\nReact 18 是一个重要的版本...',
    date: '2024-09-08',
    author: 'Xu Liang',
    tags: ['React', '前端开发'],
    status: 'draft',
    views: 0,
    readingTime: 10
  }
];

export default function PostsManagement() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // 过滤文章
  useEffect(() => {
    let filtered = articles;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchTerm, statusFilter]);

  // 分页
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  // 删除文章
  const handleDeleteArticle = (id: string) => {
    if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  // 批量删除
  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) {
      alert('请先选择要删除的文章');
      return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedArticles.length} 篇文章吗？此操作不可恢复。`)) {
      setArticles(articles.filter(article => !selectedArticles.includes(article.id)));
      setSelectedArticles([]);
    }
  };

  // 切换文章状态
  const toggleArticleStatus = (id: string, newStatus: Article['status']) => {
    setArticles(articles.map(article =>
      article.id === id ? { ...article, status: newStatus } : article
    ));
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
  const toggleSelectArticle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(articleId => articleId !== id) : [...prev, id]
    );
  };

  // 状态标签样式
  const getStatusBadge = (status: Article['status']) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      published: '已发布',
      draft: '草稿',
      archived: '已归档'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="mt-2 text-gray-600">管理你的所有博客文章</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总文章数</p>
                <p className="text-2xl font-semibold text-gray-900">{articles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总浏览量</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">P</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已发布</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.filter(a => a.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-semibold">D</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">草稿</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {articles.filter(a => a.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                {/* 批量操作 */}
                {selectedArticles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      已选择 {selectedArticles.length} 篇文章
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
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
                  href="/admin/posts/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建文章
                </Link>
              </div>
            </div>
          </div>

          {/* 搜索和过滤 */}
          <div className="p-4 border-b border-gray-200">
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* 状态过滤器 */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'archived')}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">所有状态</option>
                    <option value="published">已发布</option>
                    <option value="draft">草稿</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 文章列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === currentArticles.length && currentArticles.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    统计
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
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
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(article.date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {article.status === 'draft' && (
                          <button
                            onClick={() => toggleArticleStatus(article.id, 'published')}
                            className="text-green-600 hover:text-green-900"
                            title="发布"
                          >
                            发布
                          </button>
                        )}
                        <Link
                          href={`/admin/posts/edit/${article.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/posts/${article.id}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="预览"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-900"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
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
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{startIndex + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + articlesPerPage, filteredArticles.length)}
                  </span>{' '}
                  条，共 <span className="font-medium">{filteredArticles.length}</span> 条结果
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无文章</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? '没有找到匹配的文章，请调整搜索条件或过滤器。'
                  : '开始创建你的第一篇博客文章吧！'
                }
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新建文章
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}