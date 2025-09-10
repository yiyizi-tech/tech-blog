'use client';

import { useState } from 'react';
import Editor from '../../../components/Editor';

interface ArticleData {
  title: string;
  content: string;
  tags: string[];
  excerpt: string;
}

export default function EditorPage() {
  const [article, setArticle] = useState<ArticleData>({
    title: '',
    content: '',
    tags: [],
    excerpt: '',
  });
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleContentChange = (content: string) => {
    setArticle(prev => ({ ...prev, content }));
    
    // 自动生成摘要（取前100个字符）
    const plainText = content.replace(/[#*`_\[\]()]/g, '').trim();
    if (plainText.length > 0) {
      setArticle(prev => ({ 
        ...prev, 
        excerpt: plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '')
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!article.tags.includes(tagInput.trim())) {
        setArticle(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePublish = async () => {
    if (!article.title.trim() || !article.content.trim()) {
      alert('请填写文章标题和内容');
      return;
    }

    setIsPublishing(true);
    
    try {
      // 这里应该是实际的发布逻辑
      // 例如：API 调用保存到数据库
      console.log('发布文章:', {
        ...article,
        date: new Date().toISOString().split('T')[0],
        id: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });

      // 模拟发布过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('文章发布成功！');
      
      // 重置表单
      setArticle({
        title: '',
        content: '',
        tags: [],
        excerpt: '',
      });
      
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">文章编辑器</h1>
        <p className="mt-1 text-gray-400">创建和编辑您的博客文章</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">编辑文章</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (confirm('确定要清空所有内容吗？')) {
                  setArticle({
                    title: '',
                    content: '',
                    tags: [],
                    excerpt: '',
                  });
                }
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              清空
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !article.title.trim() || !article.content.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  发布中...
                </>
              ) : (
                '发布文章'
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* 文章标题 */}
            <div>
              <input
                type="text"
                value={article.title}
                onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入文章标题..."
                className="w-full text-2xl font-bold bg-transparent border-b border-gray-700 outline-none placeholder-gray-500 text-white focus:border-blue-500 pb-2"
              />
            </div>

            {/* 标签输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                标签（按 Enter 添加）
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {article.tags.map((tag) => (
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

            {/* 编辑器 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                文章内容
              </label>
              <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                <Editor
                  content={article.content}
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
                  <span className="text-white ml-2">{article.title || '未填写'}</span>
                </div>
                <div>
                  <span className="text-gray-400">字数：</span>
                  <span className="text-white ml-2">{article.content.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">标签：</span>
                  <span className="text-white ml-2">
                    {article.tags.length > 0 ? article.tags.join(', ') : '无'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">摘要：</span>
                  <span className="text-white ml-2">{article.excerpt || '暂无'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}