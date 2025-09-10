import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // 只保护 /admin 路径
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 检查用户是否已登录
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    // 如果用户未登录，重定向到登录页面
    if (!token) {
      // 安全地构造URL以避免Invalid URL错误
      try {
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
      } catch (error) {
        // 如果URL构造失败，使用相对路径重定向
        return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}