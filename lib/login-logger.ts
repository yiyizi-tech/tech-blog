import fs from 'fs'
import path from 'path'

export interface LogEntry {
  timestamp: string
  level: 'INFO' | 'ERROR' | 'WARN'
  message: string
  data?: any
  userAgent?: string
  ip?: string
}

class LoginLogger {
  private logFilePath: string
  private maxFileSize: number = 10 * 1024 * 1024 // 10MB
  private maxFiles: number = 5

  constructor() {
    this.logFilePath = path.join(process.cwd(), 'logs', 'login-errors.log')
    this.ensureLogDirectory()
  }

  private ensureLogDirectory() {
    const logDir = path.dirname(this.logFilePath)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
  }

  private rotateLogIfNeeded() {
    if (fs.existsSync(this.logFilePath)) {
      const stats = fs.statSync(this.logFilePath)
      if (stats.size > this.maxFileSize) {
        // Rotate log files
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${this.logFilePath}.${i}`
          const newFile = `${this.logFilePath}.${i + 1}`
          if (fs.existsSync(oldFile)) {
            fs.renameSync(oldFile, newFile)
          }
        }
        fs.renameSync(this.logFilePath, `${this.logFilePath}.1`)
      }
    }
  }

  private writeLog(entry: LogEntry) {
    this.rotateLogIfNeeded()
    
    const logLine = JSON.stringify(entry) + '\n'
    fs.appendFileSync(this.logFilePath, logLine)
  }

  logInfo(message: string, data?: any, userAgent?: string, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data,
      userAgent,
      ip
    }
    this.writeLog(entry)
  }

  logError(message: string, error?: any, userAgent?: string, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      data: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      userAgent,
      ip
    }
    this.writeLog(entry)
  }

  logWarning(message: string, data?: any, userAgent?: string, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      data,
      userAgent,
      ip
    }
    this.writeLog(entry)
  }

  getRecentLogs(lines: number = 100): LogEntry[] {
    if (!fs.existsSync(this.logFilePath)) {
      return []
    }

    try {
      const content = fs.readFileSync(this.logFilePath, 'utf-8')
      const logLines = content.trim().split('\n').filter(line => line.length > 0)
      const recentLines = logLines.slice(-lines)
      
      return recentLines.map(line => {
        try {
          return JSON.parse(line)
        } catch (e) {
          return {
            timestamp: new Date().toISOString(),
            level: 'ERROR' as const,
            message: 'Failed to parse log line',
            data: { line }
          }
        }
      })
    } catch (error) {
      return [{
        timestamp: new Date().toISOString(),
        level: 'ERROR' as const,
        message: 'Failed to read log file',
        data: error instanceof Error ? error.message : String(error)
      }]
    }
  }
}

export const loginLogger = new LoginLogger()