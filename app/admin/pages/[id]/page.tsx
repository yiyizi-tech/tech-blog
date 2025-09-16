'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Editor from '../../../../components/Editor';
import { AlertModal } from '../../../../components/Modal';
import { useModal } from '../../../../hooks/useModal';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  template: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  
  const [page, setPage] = useState<Page | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [template, setTemplate] = useState('default');
  const [author, setAuthor] = useState('管理员');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const modal = useModal();

  // 获取页面数据
  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId || pageId === 'new') {
        // 新建页面
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pages/${pageId}`);
        if (response.ok) {
          const pageData = await response.json();
          setPage(pageData);
          setTitle(pageData.title);
          setSlug(pageData.slug);
          setContent(pageData.content || '');
          setPublished(pageData.published);
          setTemplate(pageData.template || 'default');
          setAuthor(pageData.author || '管理员');
        } else {
          modal.error('错误', '获取页面数据失败');
        }
      } catch (error) {
        console.error('获取页面数据失败:', error);
        modal.error('错误', '获取页面数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  // 保存页面
  const handleSave = async () => {
    if (!title.trim()) {
      modal.error('错误', '请输入页面标题');
      return;
    }

    if (!slug.trim()) {
      modal.error('错误', '请输入页面slug');
      return;
    }

    setSaving(true);

    try {
      const pageData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content || '',
        published,
        template,
        author: author.trim() || '管理员'
      };

      const response = await fetch(
        pageId === 'new' ? '/api/pages' : `/api/pages/${pageId}`,
        {
          method: pageId === 'new' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        modal.success('成功', `页面${pageId === 'new' ? '创建' : '更新'}成功！`);
        
        if (pageId === 'new') {
          // 新建页面成功后跳转到编辑页面
          router.replace(`/admin/pages/${result.id}`);
        }
      } else {
        const error = await response.json();
        modal.error('错误', error.error || `${pageId === 'new' ? '创建' : '更新'}页面失败`);
      }
    } catch (error) {
      console.error('保存页面失败:', error);
      modal.error('错误', '保存页面失败');
    } finally {
      setSaving(false);
    }
  };

  // 预览页面
  const handlePreview = () => {
    if (!slug) {
      modal.error('错误', '请先设置页面slug');
      return;
    }
    
    // 在新窗口中打开预览
    window.open(`/${slug}`, '_blank');
  };

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 保留中文字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符合并为一个
      .trim();
  };

  // 当标题变化时自动生成slug（仅在新建页面时）
  useEffect(() => {
    if (pageId === 'new' && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, pageId, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">加载中...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 头部工具栏 */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/pages" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-white">
                {pageId === 'new' ? '新建页面' : '编辑页面'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="px-4 py-2 text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-300/50 rounded-lg transition-colors cursor-pointer"
                disabled={!slug}
              >
                预览
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? '保存中...' : '保存页面'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* 页面设置 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">页面设置</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    页面标题 *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入页面标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    页面Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="页面URL路径"
                  />
                  {slug && (
                    <p className="mt-1 text-xs text-gray-400">
                      访问地址: /{slug}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    页面模板
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="default">默认模板</option>
                    <option value="simple">简单模板</option>
                    <option value="full-width">全宽模板</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="页面作者"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="mr-2 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm text-gray-300">
                    立即发布
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 页面内容编辑器 */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="border-b border-gray-700 px-4 py-3">
                <h3 className="text-lg font-semibold text-white">页面内容</h3>
              </div>
              <div className="bg-gray-800">
                <Editor
                  content={content}
                  onChange={setContent}
                  placeholder="在这里开始编写页面内容..."
                  onSave={handleSave}
                  onPreview={handlePreview}
                />
              </div>
            </div>
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
    </div>
  );
}