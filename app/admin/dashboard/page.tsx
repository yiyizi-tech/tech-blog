import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { name: '总文章数', value: '3' },
    { name: '已发布', value: '3' },
    { name: '总用户数', value: '1' },
    { name: '草稿数', value: '0' },
  ];

  const recentPosts = [
    { id: 1, title: 'Next.js 15 完整指南', published: true, createdAt: '2025-01-01 10:00' },
    { id: 2, title: 'TypeScript 高级模式', published: true, createdAt: '2025-01-02 15:30' },
    { id: 3, title: 'Tailwind CSS 技巧', published: true, createdAt: '2025-01-03 09:15' },
  ];

  const quickActions = [
    { name: '写新文章', href: '/admin/editor', icon: '✍️' },
    { name: '查看网站', href: '/', icon: '🌐' },
    { name: '管理评论', href: '/admin/comments', icon: '💬' },
    { name: '系统设置', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-white">仪表板</h1>
        <p className="mt-1 text-gray-400">欢迎回来！这里是你网站的概览。</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-800 overflow-hidden rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{stat.name}</dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近文章 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">最近文章</h2>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="overflow-hidden bg-gray-800 shadow sm:rounded-md">
                <ul className="divide-y divide-gray-700">
                  {recentPosts.map((post) => (
                    <li key={post.id}>
                      <Link href={`/admin/editor?id=${post.id}`} className="block hover:bg-gray-700">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-blue-400">{post.title}</p>
                            <div className="ml-2 flex flex-shrink-0">
                              <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                post.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.published ? '已发布' : '草稿'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              {/* 可以添加标签等信息 */}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                              <span>{post.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div>
          <div className="bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">快速操作</h2>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium text-white">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 系统状态 */}
          <div className="mt-6 bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">系统状态</h2>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-400">
                    <span>存储使用</span>
                    <span>15%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>系统运行正常</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    在线
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}