'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: '壹壹零壹Blog',
    siteDescription: 'A modern personal technology blog built with Next.js and TypeScript',
    siteUrl: 'https://yiyizi.top',
    adminEmail: 'admin@yiyizi.top',
  });

  const [userSettings, setUserSettings] = useState({
    name: 'Admin',
    email: 'admin@yiyizi.top',
    notification: true,
  });

  const handleSaveSiteSettings = () => {
    // 这里应该是实际的保存逻辑
    console.log('保存站点设置:', siteSettings);
    alert('站点设置已保存');
  };

  const handleSaveUserSettings = () => {
    // 这里应该是实际的保存逻辑
    console.log('保存用户设置:', userSettings);
    alert('用户设置已保存');
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="mt-1 text-gray-400">配置您的网站和账户设置</p>
      </div>

      <div className="space-y-6">
        {/* 站点设置 */}
        <div className="bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">站点设置</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-400">
                  站点名称
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-400">
                  站点描述
                </label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-400">
                  站点URL
                </label>
                <input
                  type="text"
                  id="siteUrl"
                  value={siteSettings.siteUrl}
                  onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-400">
                  管理员邮箱
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={siteSettings.adminEmail}
                  onChange={(e) => setSiteSettings({...siteSettings, adminEmail: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSiteSettings}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 用户设置 */}
        <div className="bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">用户设置</h2>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-400">
                  用户名
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userSettings.name}
                  onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-400">
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="notification"
                  name="notification"
                  type="checkbox"
                  checked={userSettings.notification}
                  onChange={(e) => setUserSettings({...userSettings, notification: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="notification" className="ml-2 block text-sm text-gray-400">
                  接收通知邮件
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveUserSettings}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}