import * as Sentry from '@sentry/nextjs'

interface ErrorLoggerOptions {
  context?: Record<string, any>
  level?: 'error' | 'warning' | 'info'
  user?: {
    id: string
    email?: string
  }
}

class ErrorLogger {
  private static instance: ErrorLogger
  private initialized: boolean = false

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  public initialize(dsn: string) {
    if (!this.initialized) {
      Sentry.init({
        dsn,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
      })
      this.initialized = true
    }
  }

  public logError(error: Error, options?: ErrorLoggerOptions) {
    console.error('Error:', error)

    if (process.env.NODE_ENV === 'development') {
      console.error('Error Stack:', error.stack)
      if (options?.context) {
        console.error('Error Context:', options.context)
      }
      return
    }

    if (options?.user) {
      Sentry.setUser(options.user)
    }

    if (options?.context) {
      Sentry.setContext('additional', options.context)
    }

    if (options?.level === 'warning') {
      Sentry.captureMessage(error.message, 'warning')
    } else {
      Sentry.captureException(error)
    }
  }

  public logMessage(message: string, options?: ErrorLoggerOptions) {
    console.log('Log:', message)

    if (process.env.NODE_ENV === 'development') {
      if (options?.context) {
        console.log('Log Context:', options.context)
      }
      return
    }

    if (options?.user) {
      Sentry.setUser(options.user)
    }

    if (options?.context) {
      Sentry.setContext('additional', options.context)
    }

    Sentry.captureMessage(message, options?.level || 'info')
  }

  public setUser(user: { id: string; email?: string }) {
    if (process.env.NODE_ENV !== 'development') {
      Sentry.setUser(user)
    }
  }

  public clearUser() {
    if (process.env.NODE_ENV !== 'development') {
      Sentry.setUser(null)
    }
  }
}

export const errorLogger = ErrorLogger.getInstance()
