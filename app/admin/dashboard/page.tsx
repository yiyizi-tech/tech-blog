'use client';

import { useState, useEffect } from 'react';
import { parseTags } from '@/lib/tags';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import Link from 'next/link';

interface Post {
  id: number;
  slug: string;
  title: string;
  views: number;
  createdAt: string;
  published: boolean;
  tags: string; // JSON string representation of tags array
}

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

// 初始化为空数组，将基于真实数据填充
const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const quickActions = [
  { name: '写新文章', href: '/admin/editor', icon: '✍️' },
  { name: '查看网站', href: '/', icon: '🌐' },
  { name: '管理评论', href: '/admin/comments', icon: '💬' },
  { name: '系统设置', href: '/admin/settings', icon: '⚙️' },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState<Array<{name: string, views: number}>>([]);
  const [postData, setPostData] = useState<Array<{name: string, posts: number}>>([]);
  const [categoryData, setCategoryData] = useState<Array<{name: string, value: number, color: string}>>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('早上好');
    } else if (hour < 18) {
      setGreeting('下午好');
    } else {
      setGreeting('晚上好');
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 获取所有文章
      const response = await fetch('/api/posts?page=1&limit=1000');
      const data = await response.json();
      
      if (response.ok) {
        const allPosts = data.posts;
        setPosts(allPosts.slice(0, 5)); // 只取前5篇用于显示

        // 计算统计数据
        const totalPosts = allPosts.length;
        const publishedPosts = allPosts.filter((post: Post) => post.published).length;
        const draftPosts = totalPosts - publishedPosts;
        const totalViews = allPosts.reduce((sum: number, post: Post) => sum + post.views, 0);

        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
          totalViews
        });

        // 生成真实的图表数据
        generateChartData(allPosts);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成图表数据的函数
  const generateChartData = (posts: Post[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 生成最近12个月的数据
    const monthlyData = [];
    const monthlyPosts = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      // 计算该月的文章数和浏览量
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthPosts = posts.filter((post: Post) => {
        const postDate = new Date(post.createdAt);
        return postDate >= monthStart && postDate <= monthEnd;
      });
      
      const monthViews = monthPosts.reduce((sum, post) => sum + post.views, 0);
      
      monthlyData.push({ name: monthName, views: monthViews });
      monthlyPosts.push({ name: monthName, posts: monthPosts.length });
    }
    
    setViewData(monthlyData);
    setPostData(monthlyPosts);
    
    // 生成分类数据（基于标签）
    const tagCount = new Map<string, number>();
    posts.forEach((post: Post) => {
      const tags = parseTags(post.tags);
      tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const categories = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // 只取前6个最多的标签
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index] || colors[0]
      }));
      
    setCategoryData(categories);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
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
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {change && (
              <p className="text-sm mt-2">
                <span className="text-green-400">↑ {change}</span>
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
    <div className="space-y-6">
      {/* 欢迎标题 */}
      <div>
        <p className="text-gray-400">{greeting}，管理员！这是你的博客管理仪表板，快速了解网站运行状况。</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总文章数"
          value={loading ? '-' : stats.totalPosts}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="已发布文章"
          value={loading ? '-' : stats.publishedPosts}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="草稿文章"
          value={loading ? '-' : stats.draftPosts}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="总浏览量"
          value={loading ? '-' : stats.totalViews.toLocaleString()}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 浏览量趋势 */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">浏览量趋势</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 文章发布统计 */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">文章发布统计</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="posts" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 分类分布 */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">文章分类分布</h2>
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
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">快速操作</h2>
          </div>
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

      {/* 热门文章 */}
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">热门文章</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              加载中...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              暂无文章
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{post.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        发布于 {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      post.published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {post.published ? '已发布' : '草稿'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}