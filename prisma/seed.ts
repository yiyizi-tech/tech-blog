import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('abcdefg123', 10)
  
  // 创建yiyizi.top域名的管理员用户
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@yiyizi.top' },
    update: {},
    create: {
      email: 'admin@yiyizi.top',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log('Admin user (admin@yiyizi.top) created:', admin1)
  
  // 保留原有的gmail用户（如果需要）
  const admin2 = await prisma.user.upsert({
    where: { email: 'x203458454@gmail.com' },
    update: {},
    create: {
      email: 'x203458454@gmail.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log('Admin user (x203458454@gmail.com) created:', admin2)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })