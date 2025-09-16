'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Reply, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  Globe,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { AlertModal, ConfirmModal } from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

interface Comment {
  id: string;
  content: string;
  author: string;
  email: string;
  website?: string | null;
  postId: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter === 'approved' ? 'published' : 'unpublished' })
      });

      const response = await fetch(`/api/comments?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
        setFilteredComments(data.comments);
      } else {
        modal.error('错误', data.error || '获取评论失败');
      }
    } catch (error) {
      console.error('获取评论失败:', error);
      modal.error('错误', '获取评论失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentPage, searchQuery, statusFilter]);

  const handleStatusChange = async (commentId: string, published: boolean) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const statusText = published ? '通过' : '拒绝';

    const confirmed = await modal.confirm(
      `确定要${statusText}这条评论吗？`,
      '确认操作'
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...comment,
            published
          })
        });

        if (response.ok) {
          modal.success('成功', `评论已${statusText}！`);
          fetchComments();
        } else {
          const data = await response.json();
          modal.error('错误', data.error || '操作失败');
        }
      } catch (error) {
        console.error('更新评论失败:', error);
        modal.error('错误', '操作失败');
      }
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmed = await modal.confirm(
      '确定要删除这条评论吗？此操作不可恢复。',
      '确认删除'
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          modal.success('成功', '评论删除成功！');
          setSelectedComments(prev => {
            const newSet = new Set(prev);
            newSet.delete(commentId);
            return newSet;
          });
          fetchComments();
        } else {
          const data = await response.json();
          modal.error('错误', data.error || '删除失败');
        }
      } catch (error) {
        console.error('删除评论失败:', error);
        modal.error('错误', '删除失败');
      }
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.size === 0) {
      modal.error('错误', '请先选择要操作的评论');
      return;
    }

    const actionText = {
      approve: '批量通过',
      reject: '批量拒绝',
      delete: '批量删除'
    }[action];

    const confirmed = await modal.confirm(
      `确定要${actionText}选中的 ${selectedComments.size} 条评论吗？`,
      '确认操作'
    );

    if (confirmed) {
      try {
        const promises = Array.from(selectedComments).map(async (commentId) => {
          if (action === 'delete') {
            return fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
          } else {
            const comment = comments.find(c => c.id === commentId);
            if (comment) {
              return fetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...comment,
                  published: action === 'approve'
                })
              });
            }
          }
        });

        await Promise.all(promises);
        setSelectedComments(new Set());
        modal.success('成功', `${actionText}完成！`);
        fetchComments();
      } catch (error) {
        console.error('批量操作失败:', error);
        modal.error('错误', '批量操作失败');
      }
    }
  };

  const toggleSelectComment = (commentId: string) => {
    const newSet = new Set(selectedComments);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    setSelectedComments(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedComments.size === filteredComments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(filteredComments.map(c => c.id)));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusBadge = (published: boolean) => {
    const variant = published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300';
    const label = published ? '已通过' : '待审核';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant}`}>
        {label}
      </span>
    );
  };

  const stats = {
    total: totalCount,
    approved: comments.filter(c => c.published).length,
    pending: comments.filter(c => !c.published).length,
    spam: 0
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">评论管理</h1>
          <p className="mt-1 text-gray-400">管理和审核用户评论</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">总评论数</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">已通过</p>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">待审核</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-500 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">已拒绝</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索评论内容、作者或文章标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">所有状态</option>
              <option value="approved">已通过</option>
              <option value="pending">待审核</option>
            </select>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedComments.size > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                已选择 {selectedComments.size} 条评论
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors cursor-pointer"
                >
                  批量通过
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  批量拒绝
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  批量删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 评论列表 */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">评论列表</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedComments.size === filteredComments.length && filteredComments.length > 0}
                onChange={toggleSelectAll}
                className="mr-2 cursor-pointer"
              />
              <span className="text-sm text-gray-300">全选</span>
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  选择
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  评论内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  文章
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedComments.has(comment.id)}
                      onChange={() => toggleSelectComment(comment.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-white line-clamp-3">
                        {comment.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">{comment.author}</p>
                        <p className="text-xs text-gray-400">{comment.email}</p>
                        {comment.website && (
                          <a href={comment.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                            <Globe className="w-3 h-3 inline mr-1" />
                            网站
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      文章 ID: {comment.postId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(comment.published)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {!comment.published ? (
                        <button
                          onClick={() => handleStatusChange(comment.id, true)}
                          className="text-green-400 hover:text-green-300 cursor-pointer"
                          title="通过"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(comment.id, false)}
                          className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                          title="设为待审核"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
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

        {filteredComments.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">暂无评论</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || statusFilter !== 'all' ? '没有找到符合条件的评论' : '等待用户评论'}
            </p>
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
                显示 {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalCount)} 条，共 {totalCount} 条
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
    </div>
  );
}