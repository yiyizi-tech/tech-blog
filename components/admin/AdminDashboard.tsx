'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Activity,
  Target,
  BarChart3,
  PieChart,
  LucideIcon
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// 模拟数据
const mockStats = {
  totalPosts: 12,
  totalViews: 25680,
  totalComments: 156,
  monthlyGrowth: 15.2
};

const recentPosts = [
  {
    id: 'nextjs-15-complete-guide',
    title: 'Next.js 15 完整指南：从入门到精通',
    views: 1250,
    date: '2024-09-05',
    status: 'published'
  },
  {
    id: 'typescript-advanced-patterns',
    title: 'TypeScript 高级模式与最佳实践',
    views: 890,
    date: '2024-09-03',
    status: 'published'
  },
  {
    id: 'tailwind-css-tips',
    title: 'Tailwind CSS 技巧',
    views: 654,
    date: '2024-09-01',
    status: 'published'
  }
];

const viewData = [
  { name: '1月', views: 4000 },
  { name: '2月', views: 3000 },
  { name: '3月', views: 2000 },
  { name: '4月', views: 2780 },
  { name: '5月', views: 1890 },
  { name: '6月', views: 2390 },
  { name: '7月', views: 3490 },
  { name: '8月', views: 4200 },
  { name: '9月', views: 3800 }
];

const postData = [
  { name: '1月', posts: 2 },
  { name: '2月', posts: 1 },
  { name: '3月', posts: 3 },
  { name: '4月', posts: 2 },
  { name: '5月', posts: 1 },
  { name: '6月', posts: 2 },
  { name: '7月', posts: 3 },
  { name: '8月', posts: 2 },
  { name: '9月', posts: 1 }
];

const categoryData = [
  { name: '前端开发', value: 8, color: '#3b82f6' },
  { name: '后端开发', value: 2, color: '#10b981' },
  { name: '工具分享', value: 1, color: '#f59e0b' },
  { name: '其他', value: 1, color: '#ef4444' }
];

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('早上好');
    } else if (hour < 18) {
      setGreeting('下午好');
    } else {
      setGreeting('晚上好');
    }
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className="text-sm mt-2">
                <span className="text-green-600">↑ {change}</span>
                <span className="text-gray-500 ml-1">vs 上月</span>
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 欢迎标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{greeting}，管理员！</h1>
          <p className="mt-2 text-gray-600">这是你的博客管理仪表板，快速了解网站运行状况。</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总文章数"
            value={mockStats.totalPosts}
            change={`${mockStats.monthlyGrowth}%`}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="总浏览量"
            value={mockStats.totalViews.toLocaleString()}
            change={`${mockStats.monthlyGrowth}%`}
            icon={Eye}
            color="green"
          />
          <StatCard
            title="评论数"
            value={mockStats.totalComments}
            change="12%"
            icon={Users}
            color="purple"
          />
          <StatCard
            title="本月发布"
            value="3"
            change="25%"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 浏览量趋势 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">浏览量趋势</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 文章发布统计 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">文章发布统计</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 分类分布 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">文章分类分布</h2>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最近活动</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">发布了新文章</p>
                  <p className="text-xs text-gray-500">Next.js 15 完整指南 - 2小时前</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">浏览量突破</p>
                  <p className="text-xs text-gray-500">今日浏览量达到 1,234 - 4小时前</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">新评论</p>
                  <p className="text-xs text-gray-500">TypeScript 文章收到新评论 - 6小时前</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">目标达成</p>
                  <p className="text-xs text-gray-500">本月发布 3 篇文章 - 昨天</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 热门文章 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">热门文章</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        发布于 {new Date(post.date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}