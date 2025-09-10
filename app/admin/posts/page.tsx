'use client';

import Link from 'next/link';

export default function PostsPage() {
  // 模拟文章数据
  const posts = [
    { id: 1, title: 'Next.js 15新特性详解', status: '已发布', author: 'Admin', date: '2025-09-08', views: 120 },
    { id: 2, title: 'TypeScript高级模式', status: '草稿', author: 'Admin', date: '2025-09-07', views: 0 },
    { id: 3, title: 'Tailwind CSS技巧', status: '已发布', author: 'Admin', date: '2025-09-06', views: 340 },
  ];

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      // 这里应该是实际的删除逻辑
      console.log('删除文章:', id);
      alert('文章已删除');
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">文章管理</h1>
          <p className="mt-1 text-gray-400">管理您的所有博客文章</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/editor"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            写新文章
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white">文章列表</h2>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-hidden bg-gray-800 shadow sm:rounded-md">
            <ul className="divide-y divide-gray-700">
              {posts.map((post) => (
                <li key={post.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-400 truncate">{post.title}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-400">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === '已发布' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {post.status}
                          </span>
                          <span className="ml-2">作者: {post.author}</span>
                          <span className="ml-2">浏览量: {post.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">{post.date}</span>
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/editor`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}