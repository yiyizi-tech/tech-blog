import { NextRequest, NextResponse } from 'next/server'
import { loginLogger } from '@/lib/login-logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lines = parseInt(searchParams.get('lines') || '50')
    
    const logs = loginLogger.getRecentLogs(lines)
    
    return NextResponse.json({ 
      success: true, 
      logs,
      count: logs.length 
    })
  } catch (error) {
    console.error('Failed to get login logs:', error)
    return NextResponse.json({ 
      error: 'Failed to get logs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}