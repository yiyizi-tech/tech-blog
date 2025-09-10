import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPosts() {
  try {
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Posts in database:', posts);
    
    const postCount = await prisma.post.count();
    console.log('Total posts:', postCount);
  } catch (error) {
    console.error('Error checking posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();