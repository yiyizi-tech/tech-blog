'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 关闭侧边栏当路由改变时
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navigation = [
    { name: '博客首页', href: '/', icon: '🏠' },
    { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
    { name: '文章管理', href: '/admin/posts', icon: '📝' },
    { name: '文章编辑', href: '/admin/editor', icon: '✏️' },
    { name: '页面管理', href: '/admin/pages', icon: '📄' },
    { name: '媒体库', href: '/admin/media', icon: '🖼️' },
    { name: '评论管理', href: '/admin/comments', icon: '💬' },
    { name: '用户管理', href: '/admin/users', icon: '👥' },
    { name: '设置', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <div className="w-64 bg-gray-800 lg:h-screen lg:overflow-y-auto">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <h1 className="text-white text-xl font-bold">管理后台</h1>
          </div>
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    pathname === item.href
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transform ${isClient && sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-white text-xl font-bold">管理后台</h1>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  pathname === item.href
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              type="button"
              className="text-gray-400 focus:outline-none lg:hidden cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">打开侧边栏</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 flex justify-between">
              <div className="text-white text-lg font-medium">
                {navigation.find(item => item.href === pathname)?.name || '管理后台'}
              </div>
              <div className="flex items-center">
                <button className="ml-4 flex text-sm rounded-full focus:outline-none cursor-pointer">
                  <span className="sr-only">管理员菜单</span>
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                    A
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}