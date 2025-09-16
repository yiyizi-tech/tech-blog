'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Globe,
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import { AlertModal, ConfirmModal, PromptModal } from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  template: string;
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  const handleCreatePage = async () => {
    const title = await modal.prompt('请输入页面标题:', '新建页面');
    if (!title) return;

    const slug = await modal.prompt('请输入页面slug:', 'slug');
    if (!slug) return;

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          slug,
          content: '',
          published: false
        })
      });

      const data = await response.json();

      if (response.ok) {
        modal.success('成功', '页面创建成功！');
        fetchPages();
      } else {
        modal.error('错误', data.error || '创建页面失败');
      }
    } catch (error) {
      console.error('创建页面失败:', error);
      modal.error('错误', '创建页面失败');
    }
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pages?page=${currentPage}&limit=20`);
      const data = await response.json();
      
      if (response.ok) {
        setPages(data.pages);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      } else {
        modal.error('错误', data.error || '获取页面列表失败');
      }
    } catch (error) {
      console.error('获取页面列表失败:', error);
      modal.error('错误', '获取页面列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    const confirmed = await modal.confirm('确定要删除这个页面吗？此操作不可恢复。', '确认删除');
    if (confirmed) {
      try {
        const response = await fetch(`/api/pages/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          modal.success('成功', '页面删除成功！');
          fetchPages();
        } else {
          const data = await response.json();
          modal.error('错误', data.error || '删除失败');
        }
      } catch (error) {
        console.error('删除页面失败:', error);
        modal.error('错误', '删除页面失败');
      }
    }
  };

  const togglePublishStatus = async (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...page,
          published: !page.published
        })
      });

      if (response.ok) {
        modal.success('成功', `页面${!page.published ? '已发布' : '已取消发布'}！`);
        fetchPages();
      } else {
        const data = await response.json();
        modal.error('错误', data.error || '操作失败');
      }
    } catch (error) {
      console.error('更新页面状态失败:', error);
      modal.error('错误', '操作失败');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">页面管理</h1>
          <p className="mt-1 text-gray-400">管理静态页面和站点内容</p>
        </div>
        <button 
          onClick={handleCreatePage}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          新建页面
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">总页面数</p>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">已发布</p>
              <p className="text-2xl font-bold text-white">{pages.filter(p => p.published).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">草稿</p>
              <p className="text-2xl font-bold text-white">{pages.filter(p => !p.published).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">模板数</p>
              <p className="text-2xl font-bold text-white">{new Set(pages.map(p => p.template)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 页面列表 */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">页面列表</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  页面信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  模板
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{page.title}</div>
                        <div className="text-sm text-gray-400">/{page.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      page.published
                        ? 'bg-green-900 text-green-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {page.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {page.template}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(page.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/${page.slug}${page.published ? '' : '?preview=true'}`}
                        className="text-blue-400 hover:text-blue-300 cursor-pointer"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="text-green-400 hover:text-green-300 cursor-pointer"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => togglePublishStatus(page.id)}
                        className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                        title={page.published ? '取消发布' : '发布'}
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                        title="删除"
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

        {pages.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">暂无页面</h3>
            <p className="mt-1 text-sm text-gray-400">开始创建你的第一个页面</p>
            <div className="mt-6">
              <button 
                onClick={handleCreatePage}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                新建页面
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white">加载中...</span>
            </div>
          </div>
        )}
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                显示 {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalCount)} 条，共 {totalCount} 条
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  上一页
                </button>
                <span className="px-3 py-2 text-gray-300">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  下一页
                </button>
              </div>
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

      <PromptModal
        isOpen={modal.promptModal.isOpen}
        onClose={() => modal.closePrompt(null)}
        onConfirm={(value) => modal.closePrompt(value)}
        title={modal.promptModal.options?.title || ''}
        message={modal.promptModal.options?.message || ''}
        placeholder={modal.promptModal.options?.placeholder}
        defaultValue={modal.promptModal.options?.defaultValue}
      />
    </div>
  );
}