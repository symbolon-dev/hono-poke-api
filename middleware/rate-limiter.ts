import type { Context, Next } from 'hono'

type RateLimiterOptions = {
    windowMs?: number
    max?: number
}

export const rateLimiter = (options: RateLimiterOptions = {}) => {
    const requests = new Map<string, number[]>()
    const windowMs = options.windowMs ?? 15 * 60 * 1000
    const max = options.max ?? 100
    
    setInterval(() => {
        const now = Date.now()
        const windowStart = now - windowMs
        
        const cleanedEntries = Array.from(requests.entries())
        .map(([ip, timestamps]) => ({
            ip,
            validTimestamps: timestamps.filter(time => time > windowStart)
        }))
        .filter(({ validTimestamps }) => validTimestamps.length > 0)
        
        requests.clear()
        cleanedEntries.forEach(({ ip, validTimestamps }) => requests.set(ip, validTimestamps))
    }, 5 * 60 * 1000)
    
    return async (c: Context, next: Next) => {
        const ip = c.req.header('x-forwarded-for') ?? c.req.header('cf-connecting-ip') ?? 'unknown'
        const now = Date.now()
        const windowStart = now - windowMs
        
        const userRequests = requests.get(ip)?.filter(time => time > windowStart) ?? []
        
        if (userRequests.length >= max) {
        return c.json({ 
            error: '🚦 Too many requests. Please try again later.',
            retryAfter: Math.ceil(windowMs / 1000)
        }, 429)
        }
        
        userRequests.push(now)
        requests.set(ip, userRequests)
        
        c.header('X-RateLimit-Limit', max.toString())
        c.header('X-RateLimit-Remaining', (max - userRequests.length).toString())
        c.header('X-RateLimit-Reset', new Date(now + windowMs).toISOString())
        
        await next()
    }
}
