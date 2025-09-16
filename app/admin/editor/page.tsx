'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AlertModal, ConfirmModal } from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';
import { parseTags, stringifyTags } from '@/lib/tags';

// 动态导入重型组件
const Editor = dynamic(() => import('../../../components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden p-8">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">编辑器加载中...</p>
        </div>
      </div>
    </div>
  )
});

const MediaSelector = dynamic(() => import('../../../components/MediaSelector'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});
// 移除Markdown转换相关的导入，直接使用HTML

interface ArticleData {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  tags: string;  // 现在是JSON字符串
  excerpt: string | null;
  createdAt: string;
  published: boolean;
  author: string | null;
  views: number;
  readingTime: number;
}

function EditorPageContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [isCreating, setIsCreating] = useState(!editId);
  const [loading, setLoading] = useState(true);
  
  const [currentArticle, setCurrentArticle] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    excerpt: '',
    coverImage: '',
    published: false,
    author: '管理员'
  });
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const modal = useModal();

  // 获取文章列表
  useEffect(() => {
    fetchArticles();
  }, []);

  // 如果URL中有id参数，加载对应文章
  useEffect(() => {
    if (editId && articles.length > 0) {
      const articleToEdit = articles.find(article => article.id === parseInt(editId));
      if (articleToEdit) {
        handleSelectArticle(articleToEdit);
      }
    }
  }, [editId, articles]);

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

  const handleContentChange = (content: string) => {
    setCurrentArticle(prev => ({ ...prev, content }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!currentArticle.tags.includes(tagInput.trim())) {
        setCurrentArticle(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleMediaSelect = (mediaItem: any) => {
    setCurrentArticle(prev => ({ ...prev, coverImage: mediaItem.url }));
  };

  const handleSelectArticle = (article: ArticleData) => {
    setSelectedArticle(article);
    setCurrentArticle({
      title: article.title,
      content: article.content || '',
      tags: parseTags(article.tags),
      excerpt: article.excerpt || '',
      coverImage: (article as any).coverImage || '',
      published: article.published,
      author: article.author || '管理员'
    });
    setIsCreating(false);
    
    // 更新URL
    const url = new URL(window.location.href);
    url.searchParams.set('id', article.id.toString());
    window.history.replaceState({}, '', url.toString());
  };

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setCurrentArticle({
      title: '',
      content: '',
      tags: [],
      excerpt: '',
      coverImage: '',
      published: false,
      author: '管理员'
    });
    setIsCreating(true);
    
    // 清除URL参数
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url.toString());
  };

  // 生成slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  };

  // 计算阅读时间（基于字数，假设每分钟200字）
  const calculateReadingTime = (content: string): number => {
    const wordCount = content.length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const handleSave = async () => {
    if (!currentArticle.title.trim() || !currentArticle.content.trim()) {
      modal.error('提示', '请填写文章标题和内容');
      return;
    }

    setIsPublishing(true);
    
    try {
      if (isCreating) {
        // 创建新文章
        const postData = {
          slug: generateSlug(currentArticle.title),
          title: currentArticle.title,
          content: currentArticle.content,
          excerpt: currentArticle.excerpt || null,
          tags: stringifyTags(currentArticle.tags),
          coverImage: currentArticle.coverImage || null,
          published: currentArticle.published,
          author: currentArticle.author,
          readingTime: calculateReadingTime(currentArticle.content),
          views: 0
        };
        
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        
        if (response.ok) {
          const newPost = await response.json();
          setArticles(prev => [newPost, ...prev]);
          modal.success('成功', '文章创建成功！');
          
          // 切换到编辑模式
          setSelectedArticle(newPost);
          setIsCreating(false);
          
          // 更新URL
          const url = new URL(window.location.href);
          url.searchParams.set('id', newPost.id.toString());
          window.history.replaceState({}, '', url.toString());
        } else {
          const error = await response.json();
          modal.error('创建失败', error.error || '未知错误');
        }
      } else if (selectedArticle) {
        // 更新现有文章
        const postData = {
          title: currentArticle.title,
          content: currentArticle.content,
          excerpt: currentArticle.excerpt || null,
          tags: stringifyTags(currentArticle.tags),
          coverImage: currentArticle.coverImage || null,
          published: currentArticle.published,
          author: currentArticle.author,
          readingTime: calculateReadingTime(currentArticle.content)
        };
        
        const response = await fetch(`/api/posts/${selectedArticle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        
        if (response.ok) {
          const updatedPost = await response.json();
          setArticles(prev => 
            prev.map(article => 
              article.id === selectedArticle.id ? updatedPost : article
            )
          );
          setSelectedArticle(updatedPost);
          modal.success('成功', '文章更新成功！');
        } else {
          const error = await response.json();
          modal.error('更新失败', error.error || '未知错误');
        }
      }
      
    } catch (error) {
      console.error('保存失败:', error);
      modal.error('保存失败', '请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (articleId: number) => {
    const confirmed = await modal.confirm('确定要删除这篇文章吗？', '确认删除');
    if (confirmed) {
      try {
        const response = await fetch(`/api/posts/${articleId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setArticles(prev => prev.filter(article => article.id !== articleId));
          if (selectedArticle?.id === articleId) {
            handleCreateNew();
          }
          modal.success('成功', '文章删除成功！');
        } else {
          modal.error('删除失败', '请重试');
        }
      } catch (error) {
        console.error('删除失败:', error);
        modal.error('删除失败', '请重试');
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">文章编辑</h1>
        <p className="mt-1 text-gray-400">选择一篇文章进行编辑，或创建新文章</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 文章列表 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">文章列表</h2>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
              >
                新建文章
              </button>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  加载中...
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  暂无文章
                </div>
              ) : (
                <div className="space-y-2">
                  {articles.map((article) => (
                  <div
                    key={article.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedArticle?.id === article.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleSelectArticle(article)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            article.published
                              ? 'bg-green-900 text-green-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {article.published ? '已发布' : '草稿'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(article.id);
                        }}
                        className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 编辑器 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">
                {isCreating ? '新建文章' : selectedArticle ? '编辑文章' : '选择一篇文章'}
              </h2>
              {(selectedArticle || isCreating) && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPublishing || !currentArticle.title.trim() || !currentArticle.content.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center"
                  >
                    {isPublishing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        保存中...
                      </>
                    ) : (
                      '保存文章'
                    )}
                  </button>
                </div>
              )}
            </div>

            {(selectedArticle || isCreating) ? (
              <div className="p-6">
                <div className="space-y-6">
                  {/* 文章标题 */}
                  <div>
                    <input
                      type="text"
                      value={currentArticle.title}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="输入文章标题..."
                      className="w-full text-2xl font-bold bg-transparent border-b border-gray-700 outline-none placeholder-gray-500 text-white focus:border-blue-500 pb-2"
                    />
                  </div>

                  {/* 标签输入 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      标签（按 Enter 添加）
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="添加标签..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* 封面图片 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      封面图片（可选）
                    </label>
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowMediaSelector(true)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          从媒体库选择
                        </button>
                        {currentArticle.coverImage && currentArticle.coverImage.trim() !== '' && (
                          <button
                            type="button"
                            onClick={() => setCurrentArticle(prev => ({ ...prev, coverImage: '' }))}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            移除封面
                          </button>
                        )}
                      </div>
                      {currentArticle.coverImage && currentArticle.coverImage.trim() !== '' && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">当前封面：</p>
                          <div className="relative inline-block">
                            <img
                              src={currentArticle.coverImage}
                              alt="封面预览"
                              className="max-h-32 rounded-lg shadow-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 文章简介 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      文章简介（可选）
                    </label>
                    <textarea
                      value={currentArticle.excerpt}
                      onChange={(e) => setCurrentArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="输入文章简介，在首页和搜索结果中显示..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {currentArticle.excerpt.length}/200 字符
                    </p>
                  </div>

                  {/* 编辑器 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      文章内容
                    </label>
                    <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                      <Editor
                        content={currentArticle.content}
                        onChange={handleContentChange}
                        placeholder="开始写作你的文章..."
                      />
                    </div>
                  </div>

                  {/* 文章信息预览 */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-semibold text-white mb-4">文章信息</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">标题：</span>
                        <span className="text-white ml-2">{currentArticle.title || '未填写'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">字数：</span>
                        <span className="text-white ml-2">{currentArticle.content.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">标签：</span>
                        <span className="text-white ml-2">
                          {currentArticle.tags.length > 0 ? currentArticle.tags.join(', ') : '无'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">封面图片：</span>
                        <span className="text-white ml-2">
                          {currentArticle.coverImage ? '已设置' : '未设置（将自动使用文章中的第一张图片）'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">简介：</span>
                        <span className="text-white ml-2">
                          {currentArticle.excerpt ? `${currentArticle.excerpt.length}/200 字符` : '未填写（将自动生成）'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400">状态：</span>
                        <div className="ml-2 flex items-center space-x-3">
                          <span className={`${
                            currentArticle.published ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {currentArticle.published ? '已发布' : '草稿'}
                          </span>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={currentArticle.published}
                              onChange={(e) => setCurrentArticle(prev => ({ ...prev, published: e.target.checked }))}
                              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-sm text-gray-400">发布</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">选择一篇文章进行编辑</h3>
                <p className="text-gray-400">从左侧列表中选择一篇文章，或创建新文章</p>
              </div>
            )}
          </div>
        </div>
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
      
      {/* 媒体选择器 */}
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={handleMediaSelect}
        selectedUrl={currentArticle.coverImage}
        title="选择封面图片"
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  );
}