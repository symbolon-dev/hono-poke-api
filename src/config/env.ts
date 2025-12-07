import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('8000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGINS: z.string().default('http://localhost:3000').transform(s => s.split(',').map(o => o.trim())),
});

export const env = envSchema.parse(Bun.env);