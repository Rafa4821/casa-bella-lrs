/**
 * Simple logger utility for debugging and monitoring
 * In production, logs can be sent to external services
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // Keep last 100 logs in memory
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };

    // Store in memory
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (isDevelopment) {
      const style = this.getStyle(level);
      console.log(
        `%c[${level.toUpperCase()}]%c ${timestamp} - ${message}`,
        style,
        'color: inherit',
        data || ''
      );
    }

    // In production, you could send to external service
    if (!isDevelopment && level === LOG_LEVELS.ERROR) {
      this.sendToExternalService(logEntry);
    }
  }

  getStyle(level) {
    const styles = {
      [LOG_LEVELS.ERROR]: 'color: #ef4444; font-weight: bold',
      [LOG_LEVELS.WARN]: 'color: #f59e0b; font-weight: bold',
      [LOG_LEVELS.INFO]: 'color: #3b82f6; font-weight: bold',
      [LOG_LEVELS.DEBUG]: 'color: #6b7280; font-weight: bold',
    };
    return styles[level] || 'color: inherit';
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error,
    } : null;
    this.log(LOG_LEVELS.ERROR, message, errorData);
  }

  warn(message, data = null) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    if (isDevelopment) {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  sendToExternalService(logEntry) {
    // Placeholder for external logging service
    // Could integrate with Sentry, LogRocket, etc.
    if (isDevelopment) {
      console.log('Would send to external service:', logEntry);
    }
  }
}

export const logger = new Logger();
