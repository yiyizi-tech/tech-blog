'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Crown,
  Shield,
  User,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { AlertModal, ConfirmModal, PromptModal } from '../../../components/Modal';
import { useModal } from '../../../hooks/useModal';

interface UserAccount {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  _count?: {
    accounts: number;
    sessions: number;
  };
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const modal = useModal();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
        setFilteredUsers(data.users);
      } else {
        modal.error('错误', data.error || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      modal.error('错误', '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, statusFilter]);



  const handleDelete = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const confirmed = await modal.confirm(
      `确定要删除用户 ${user.name || user.email} 吗？此操作不可恢复。`,
      '确认删除'
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          modal.success('成功', '用户删除成功！');
          setSelectedUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          fetchUsers();
        } else {
          const data = await response.json();
          modal.error('错误', data.error || '删除失败');
        }
      } catch (error) {
        console.error('删除用户失败:', error);
        modal.error('错误', '删除用户失败');
      }
    }
  };

  const handleCreateUser = async () => {
    const name = await modal.prompt('请输入用户姓名:', '新建用户');
    if (!name) return;

    const email = await modal.prompt('请输入邮箱地址:', '邮箱地址');
    if (!email) return;

    const password = await modal.prompt('请输入初始密码:', '密码', 'password');
    if (!password) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        modal.success('成功', '用户创建成功！');
        fetchUsers();
      } else {
        modal.error('错误', data.error || '创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      modal.error('错误', '创建用户失败');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) {
      modal.error('错误', '请先选择要删除的用户');
      return;
    }

    const confirmed = await modal.confirm(
      `确定要批量删除选中的 ${selectedUsers.size} 个用户吗？此操作不可恢复。`,
      '确认删除'
    );

    if (confirmed) {
      try {
        const promises = Array.from(selectedUsers).map(userId => 
          fetch(`/api/users/${userId}`, { method: 'DELETE' })
        );

        await Promise.all(promises);
        setSelectedUsers(new Set());
        modal.success('成功', '批量删除完成！');
        fetchUsers();
      } catch (error) {
        console.error('批量删除失败:', error);
        modal.error('错误', '批量删除失败');
      }
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const getStatusBadge = (emailVerified: string | null) => {
    const isVerified = emailVerified !== null;
    const variant = isVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300';
    const label = isVerified ? '已验证' : '未验证';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant}`}>
        {label}
      </span>
    );
  };

  const stats = {
    total: totalCount,
    verified: users.filter(u => u.emailVerified !== null).length,
    unverified: users.filter(u => u.emailVerified === null).length,
    withSessions: users.filter(u => u._count && u._count.sessions > 0).length
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">用户管理</h1>
          <p className="mt-1 text-gray-400">管理系统用户和权限</p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          新建用户
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">总用户数</p>
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
              <p className="text-sm font-medium text-gray-300">已验证用户</p>
              <p className="text-2xl font-bold text-white">{stats.verified}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">未验证用户</p>
              <p className="text-2xl font-bold text-white">{stats.unverified}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">有会话用户</p>
              <p className="text-2xl font-bold text-white">{stats.withSessions}</p>
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
              placeholder="搜索用户名、邮箱或显示名称..."
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
              <option value="verified">已验证</option>
              <option value="unverified">未验证</option>
            </select>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedUsers.size > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                已选择 {selectedUsers.size} 个用户
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  批量删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 用户列表 */}
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">用户列表</h2>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
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
                  用户信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  邮箱验证
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  账户状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  用户ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name || 'User'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name || '未设置姓名'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.emailVerified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="space-y-1">
                      <div>账户: {user._count?.accounts || 0}</div>
                      <div>会话: {user._count?.sessions || 0}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email || '未设置'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                        title="删除用户"
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

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">暂无用户</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || statusFilter !== 'all' ? 
                '没有找到符合条件的用户' : 
                '开始添加第一个用户'
              }
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