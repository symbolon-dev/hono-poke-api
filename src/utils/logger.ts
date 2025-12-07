import pino from 'pino';

import { env } from '@/config/env';

export const logger = env.NODE_ENV === 'development'
    ? pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    })
    : pino({ level: 'info' });