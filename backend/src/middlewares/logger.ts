import winston from 'winston';
import expressWinston from 'express-winston';

interface LogMeta {
  message?: string;
  error?: { statusCode?: number; message?: string };
  res?: { statusCode?: number };
  req?: { method?: string; originalUrl?: string };
}

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info: winston.Logform.TransformableInfo & { meta?: LogMeta }) => {
    const status = info.meta?.error?.statusCode
      || info.meta?.res?.statusCode
      || 500;

    const method = info.meta?.req?.method;
    const url = info.meta?.req?.originalUrl;

    return `${info.timestamp} ${info.level} ${status} ${method} ${url} → ${info.message}`;
  }),
);

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
  ],
  format: devFormat,
  meta: true,
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
  format: devFormat,
});
