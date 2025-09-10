import { NextRequest, NextResponse } from 'next/server'
import { loginLogger } from '@/lib/login-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { success, email, result, error, userAgent, timestamp, url } = body
    
    // 获取客户端IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
    
    if (success) {
      loginLogger.logInfo('Login successful', {
        email,
        result,
        url
      }, userAgent, clientIP)
    } else {
      loginLogger.logError('Login failed', {
        email,
        error,
        result,
        url
      }, userAgent, clientIP)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log login attempt:', error)
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lines = parseInt(searchParams.get('lines') || '100')
    
    const logs = loginLogger.getRecentLogs(lines)
    
    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Failed to get logs:', error)
    return NextResponse.json({ error: 'Failed to get logs' }, { status: 500 })
  }
}