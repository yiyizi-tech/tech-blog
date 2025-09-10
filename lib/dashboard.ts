import { prisma } from './prisma';

export async function getDashboardStats() {
  try {
    // 获取文章总数
    const totalPosts = await prisma.post.count();
    
    // 获取已发布的文章数
    const publishedPosts = await prisma.post.count({
      where: {
        published: true
      }
    });
    
    // 获取用户总数
    const totalUsers = await prisma.user.count();
    
    // 获取最近的文章
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true
      }
    });
    
    return {
      stats: {
        totalPosts,
        publishedPosts,
        totalUsers,
      },
      recentPosts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}