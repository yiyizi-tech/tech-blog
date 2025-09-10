import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 只保护 /admin 路径
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 简单的重定向到登录页面
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}