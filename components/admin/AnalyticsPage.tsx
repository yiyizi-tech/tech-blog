'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare,
  Share2,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
// 移除重复的AdminLayout导入
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Cell, 
  Pie,
  Area,
  AreaChart,
  Legend
} from 'recharts';

// 模拟数据
const trafficData = [
  { date: '09-01', pageViews: 1200, uniqueVisitors: 800, bounceRate: 45 },
  { date: '09-02', pageViews: 1800, uniqueVisitors: 1200, bounceRate: 42 },
  { date: '09-03', pageViews: 2400, uniqueVisitors: 1600, bounceRate: 38 },
  { date: '09-04', pageViews: 2100, uniqueVisitors: 1400, bounceRate: 40 },
  { date: '09-05', pageViews: 2800, uniqueVisitors: 1900, bounceRate: 35 },
  { date: '09-06', pageViews: 3200, uniqueVisitors: 2100, bounceRate: 33 },
  { date: '09-07', pageViews: 2900, uniqueVisitors: 1950, bounceRate: 36 },
  { date: '09-08', pageViews: 3500, uniqueVisitors: 2300, bounceRate: 31 }
];

const popularPosts = [
  {
    title: 'Next.js 15 完整指南：从入门到精通',
    views: 1250,
    comments: 23,
    shares: 45,
    date: '2024-09-05'
  },
  {
    title: 'TypeScript 高级模式与最佳实践',
    views: 890,
    comments: 18,
    shares: 32,
    date: '2024-09-03'
  },
  {
    title: 'Tailwind CSS 技巧',
    views: 654,
    comments: 12,
    shares: 28,
    date: '2024-09-01'
  }
];

const deviceData = [
  { name: '桌面端', value: 65, color: '#3b82f6' },
  { name: '移动端', value: 30, color: '#10b981' },
  { name: '平板', value: 5, color: '#f59e0b' }
];

const browserData = [
  { name: 'Chrome', value: 75, color: '#3b82f6' },
  { name: 'Safari', value: 15, color: '#10b981' },
  { name: 'Firefox', value: 7, color: '#f59e0b' },
  { name: '其他', value: 3, color: '#ef4444' }
];

const timeRangeData = [
  { period: '00:00', visits: 120 },
  { period: '04:00', visits: 80 },
  { period: '08:00', visits: 450 },
  { period: '12:00', visits: 680 },
  { period: '16:00', visits: 520 },
  { period: '20:00', visits: 380 },
  { period: '24:00', visits: 150 }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };

    return (
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {change && (
              <p className="text-sm mt-2">
                <span className="text-green-600">↑ {change}</span>
                <span className="text-gray-500 ml-1">vs 上期</span>
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
      <div>
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">数据统计</h1>
            <p className="mt-2 text-gray-600">深入了解你的博客表现和用户行为</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 时间范围选择 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="7d">最近7天</option>
                <option value="30d">最近30天</option>
                <option value="90d">最近90天</option>
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </button>
            
            <button className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </button>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="页面浏览量"
            value="18,234"
            change="12.5%"
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="独立访客"
            value="8,456"
            change="8.3%"
            icon={Users}
            color="green"
          />
          <StatCard
            title="平均停留时间"
            value="3:42"
            change="15.2%"
            icon={Clock}
            color="purple"
          />
          <StatCard
            title="跳出率"
            value="38.5%"
            change="-5.2%"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* 流量趋势 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">流量趋势</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="uniqueVisitors" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 设备分布 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">设备分布</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 浏览器分布 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">浏览器分布</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 访问时间分布 */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">24小时访问分布</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 热门文章 */}
        <div className="bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-white">热门文章排行</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文章标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      浏览量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      评论数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分享数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      发布时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-200">
                  {popularPosts.map((post, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-white">
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.shares}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 实时活动 */}
        <div className="bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-white">实时活动</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-white">新访客</p>
                    <p className="text-xs text-gray-500">来自北京的用户访问了首页</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">刚刚</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-white">文章阅读</p>
                    <p className="text-xs text-gray-500">用户正在阅读 Next.js 15 完整指南</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">2分钟前</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-white">新评论</p>
                    <p className="text-xs text-gray-500">TypeScript 文章收到了新评论</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">5分钟前</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}