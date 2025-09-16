'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  X, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  Tag,
  FileText,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import Editor from '../Editor';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  slug?: string;
}

interface PostEditorProps {
  articleId?: string;
  initialData?: Partial<Article>;
}

// 模拟文章数据
const mockArticles: Record<string, Article> = {
  'nextjs-15-complete-guide': {
    id: 'nextjs-15-complete-guide',
    title: 'Next.js 15 完整指南：从入门到精通',
    excerpt: '学习如何使用最新版本的 Next.js 构建现代化 Web 应用程序及其新功能。',
    content: '# Next.js 15 完整指南：从入门到精通\n\nNext.js 15 带来了许多革命性的特性，让我们一起深入探索这个强大的 React 框架。\n\n## 什么是 Next.js？\n\nNext.js 是一个基于 React 的生产级框架，提供了：\n\n- **服务器端渲染 (SSR)**：提升 SEO 和首屏加载速度\n- **静态站点生成 (SSG)**：构建超快速的静态网站\n- **API 路由**：构建完整的全栈应用\n- **图像优化**：自动优化图片加载\n- **字体优化**：自动优化字体加载',
    date: '2024-09-05',
    author: 'Xu Liang',
    tags: ['Next.js', 'React', 'Web 开发'],
    status: 'published',
    slug: 'nextjs-15-complete-guide'
  }
};

export default function PostEditor({ articleId, initialData }: PostEditorProps) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Xu Liang',
    tags: [],
    status: 'draft'
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (articleId && mockArticles[articleId]) {
      setArticle(mockArticles[articleId]);
    } else if (initialData) {
      setArticle(prev => ({ ...prev, ...initialData }));
    }
  }, [articleId, initialData]);

  const validateArticle = () => {
    const newErrors: Record<string, string> = {};
    
    if (!article.title.trim()) {
      newErrors.title = '标题不能为空';
    }
    
    if (!article.excerpt.trim()) {
      newErrors.excerpt = '摘要不能为空';
    }
    
    if (!article.content.trim()) {
      newErrors.content = '内容不能为空';
    }
    
    if (article.tags.length === 0) {
      newErrors.tags = '至少需要一个标签';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: Article['status'] = article.status) => {
    if (!validateArticle()) {
      return;
    }

    setIsSaving(true);
    
    // 模拟保存操作
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // 更新文章状态
      setArticle(prev => ({ ...prev, status }));
      
      // 3秒后隐藏成功消息
      setTimeout(() => setShowSuccess(false), 3000);
      
      // 如果是新文章，跳转到编辑页面
      if (!articleId) {
        const slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
        router.push(`/admin/posts/edit/${slug}`);
      }
    }, 1000);
  };

  const handlePreview = () => {
    if (!validateArticle()) {
      return;
    }
    setIsPreview(true);
  };

  const addTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div>
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {articleId ? '编辑文章' : '新建文章'}
              </h1>
              <p className="text-gray-600 mt-1">
                {articleId ? '修改文章内容和设置' : '创建一篇新的博客文章'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {article.status === 'published' ? '更新发布' : '立即发布'}
            </button>
            
            <button
              onClick={handlePreview}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-800 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              预览
            </button>
          </div>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  文章保存成功！
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要编辑区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题输入 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章标题
                  {errors.title && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => {
                    setArticle(prev => ({ ...prev, title: e.target.value }));
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="输入文章标题..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
            </div>

            {/* 内容编辑器 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文章内容
                  {errors.content && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className={`border rounded-md ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <Editor
                    content={article.content}
                    onChange={(content) => {
                      setArticle(prev => ({ ...prev, content }));
                      setErrors(prev => ({ ...prev, content: '' }));
                    }}
                    placeholder="开始写作你的文章内容..."
                    onSave={() => handleSave(article.status)}
                    onPreview={handlePreview}
                  />
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.content}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 侧边栏设置 */}
          <div className="space-y-6">
            {/* 发布设置 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  发布设置
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={article.status}
                    onChange={(e) => setArticle(prev => ({ ...prev, status: e.target.value as Article['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发布时间
                  </label>
                  <input
                    type="date"
                    value={article.date}
                    onChange={(e) => setArticle(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    作者
                  </label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 文章摘要 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  文章摘要
                </h3>
              </div>
              <div className="p-4">
                <textarea
                  value={article.excerpt}
                  onChange={(e) => {
                    setArticle(prev => ({ ...prev, excerpt: e.target.value }));
                    setErrors(prev => ({ ...prev, excerpt: '' }));
                  }}
                  placeholder="输入文章摘要..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.excerpt}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  字数: {article.excerpt.length}
                </p>
              </div>
            </div>

            {/* 标签管理 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  标签
                </h3>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="添加标签..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {errors.tags && (
                  <p className="mb-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.tags}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 文章信息 */}
            <div className="bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  文章信息
                </h3>
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>字数:</span>
                  <span>{article.content.trim().split(/\s+/).length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>预计阅读时间:</span>
                  <span>{readingTime(article.content)} 分钟</span>
                </div>
                <div className="flex justify-between">
                  <span>标签数量:</span>
                  <span>{article.tags.length}</span>
                </div>
                {articleId && (
                  <div className="flex justify-between">
                    <span>文章ID:</span>
                    <span className="font-mono text-xs">{articleId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}