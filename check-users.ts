import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:', users);
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@yiyizi.top' }
    });
    console.log('Admin user:', adminUser);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();