'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Globe,
  Mail,
  Image,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AlertModal, ConfirmModal } from '../Modal';
import { useModal } from '../../hooks/useModal';
// 移除重复的AdminLayout导入

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  authorEmail: string;
  postsPerPage: number;
  commentsEnabled: boolean;
  commentsModeration: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  socialTwitter: string;
  socialGithub: string;
  socialLinkedIn: string;
  themeColor: string;
  darkMode: boolean;
  analyticsEnabled: boolean;
  analyticsId: string;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: '壹壹零壹Blog',
  siteDescription: '徐梁的个人技术博客，分享最新的技术洞察和实用教程',
  siteUrl: 'https://yiyizi.top',
  authorName: 'Xu Liang',
  authorEmail: 'x203458454@gmail.com',
  postsPerPage: 10,
  commentsEnabled: true,
  commentsModeration: true,
  seoTitle: '壹壹零壹Blog - 技术博客',
  seoDescription: '专注于前端技术、后端开发和系统架构的技术博客',
  seoKeywords: '技术博客,前端开发,后端开发,系统架构,Next.js,React,TypeScript',
  socialTwitter: '',
  socialGithub: 'https://github.com/yiyizi-tech',
  socialLinkedIn: '',
  themeColor: '#3b82f6',
  darkMode: true,
  analyticsEnabled: true,
  analyticsId: 'G-XXXXXXXXXX',
  maintenanceMode: false
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'appearance' | 'advanced'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const modal = useModal();

  const handleSave = async () => {
    setIsSaving(true);
    
    // 模拟保存操作
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleReset = async () => {
    const confirmed = await modal.confirm('确定要重置所有设置吗？此操作不可恢复。', '重置设置');
    if (confirmed) {
      setSettings(defaultSettings);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
          modal.success('成功', '设置导入成功！');
        } catch (error) {
          modal.error('导入失败', '设置文件格式错误！');
        }
      };
      reader.readAsText(file);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label }: {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        {enabled ? (
          <ToggleRight className="h-4 w-4 translate-x-6 text-white" />
        ) : (
          <ToggleLeft className="h-4 w-4 translate-x-1 text-gray-400" />
        )}
      </button>
    </div>
  );

  const SettingGroup = ({ title, icon: Icon, children }: {
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-800 rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div>
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">系统设置</h1>
            <p className="mt-2 text-gray-300">配置你的博客设置和偏好</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              导出设置
            </button>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              导入设置
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-gray-800 hover:bg-red-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  设置保存成功！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 标签导航 */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'general', label: '基本设置', icon: Settings },
              { key: 'seo', label: 'SEO设置', icon: Globe },
              { key: 'social', label: '社交媒体', icon: User },
              { key: 'appearance', label: '外观设置', icon: Palette },
              { key: 'advanced', label: '高级设置', icon: Shield }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* 设置内容 */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <SettingGroup title="站点信息" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    站点名称
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    站点URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    站点描述
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SettingGroup>

            <SettingGroup title="作者信息" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    作者姓名
                  </label>
                  <input
                    type="text"
                    value={settings.authorName}
                    onChange={(e) => setSettings(prev => ({ ...prev, authorName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    作者邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.authorEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, authorEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SettingGroup>

            <SettingGroup title="文章设置" icon={Database}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    每页显示文章数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.postsPerPage}
                    onChange={(e) => setSettings(prev => ({ ...prev, postsPerPage: parseInt(e.target.value) }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <ToggleSwitch
                  enabled={settings.commentsEnabled}
                  onChange={(enabled) => setSettings(prev => ({ ...prev, commentsEnabled: enabled }))}
                  label="启用评论功能"
                />
                
                <ToggleSwitch
                  enabled={settings.commentsModeration}
                  onChange={(enabled) => setSettings(prev => ({ ...prev, commentsModeration: enabled }))}
                  label="评论需要审核"
                />
              </div>
            </SettingGroup>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <SettingGroup title="SEO设置" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    SEO标题
                  </label>
                  <input
                    type="text"
                    value={settings.seoTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    主题色
                  </label>
                  <input
                    type="color"
                    value={settings.themeColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, themeColor: e.target.value }))}
                    className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    SEO描述
                  </label>
                  <textarea
                    value={settings.seoDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    SEO关键词
                  </label>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={(e) => setSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="用逗号分隔关键词"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SettingGroup>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <SettingGroup title="社交媒体" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={settings.socialTwitter}
                    onChange={(e) => setSettings(prev => ({ ...prev, socialTwitter: e.target.value }))}
                    placeholder="https://twitter.com/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    GitHub
                  </label>
                  <input
                    type="text"
                    value={settings.socialGithub}
                    onChange={(e) => setSettings(prev => ({ ...prev, socialGithub: e.target.value }))}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={settings.socialLinkedIn}
                    onChange={(e) => setSettings(prev => ({ ...prev, socialLinkedIn: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </SettingGroup>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <SettingGroup title="外观设置" icon={Palette}>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.darkMode}
                  onChange={(enabled) => setSettings(prev => ({ ...prev, darkMode: enabled }))}
                  label="深色模式"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    主题色
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, themeColor: e.target.value }))}
                      className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">{settings.themeColor}</span>
                  </div>
                </div>
              </div>
            </SettingGroup>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <SettingGroup title="分析统计" icon={Database}>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.analyticsEnabled}
                  onChange={(enabled) => setSettings(prev => ({ ...prev, analyticsEnabled: enabled }))}
                  label="启用分析统计"
                />
                
                {settings.analyticsEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.analyticsId}
                      onChange={(e) => setSettings(prev => ({ ...prev, analyticsId: e.target.value }))}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </SettingGroup>

            <SettingGroup title="维护模式" icon={Shield}>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.maintenanceMode}
                  onChange={(enabled) => setSettings(prev => ({ ...prev, maintenanceMode: enabled }))}
                  label="启用维护模式"
                />
                
                {settings.maintenanceMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">维护模式已启用</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>只有管理员可以访问网站。其他访客将看到维护页面。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SettingGroup>
          </div>
        )}
        
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