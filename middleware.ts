import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // 性能优化：添加安全和缓存头部
  const isStaticFile = request.nextUrl.pathname.startsWith('/_next/static') || 
                      request.nextUrl.pathname.startsWith('/uploads') ||
                      request.nextUrl.pathname.includes('.');

  if (isStaticFile) {
    // 静态文件缓存优化
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  } else {
    // 动态内容安全头部
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  // 性能优化：预加载关键资源
  if (request.nextUrl.pathname === '/') {
    response.headers.set('Link', [
      '</api/posts>; rel=preload; as=fetch'
    ].join(', '));
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}