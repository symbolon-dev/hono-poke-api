import type { Context, Next } from 'hono'

type RateLimiterOptions = {
    windowMs?: number
    max?: number
    maxIPs?: number
}

// Simple in-memory rate limiter - for production use Redis-based solution
export const rateLimiter = (options: RateLimiterOptions = {}) => {
    let requests = new Map<string, number[]>()
    let lastPrune = Date.now()

    const windowMs = options.windowMs ?? 15 * 60 * 1000 // 15 minutes
    const max = options.max ?? 100
    const maxIPs = options.maxIPs ?? 500
    const pruneInterval = 60 * 1000 // 1 minute

    const prune = () => {
        const now = Date.now()
        const windowStart = now - windowMs

        requests = new Map<string, number[]>(
            Array.from(requests.entries())
                .map(([ip, ts]): [string, number[]] => [ip, ts.filter(t => t > windowStart)])
                .filter(([, ts]) => ts.length > 0)
        )

        if (requests.size > maxIPs) {
            const sortedEntries = Array.from(requests.entries())
                .sort(([, a], [, b]) => Math.max(...b) - Math.max(...a))
                .slice(0, maxIPs)
            requests = new Map(sortedEntries)
        }

        lastPrune = now
    }

    return async (c: Context, next: Next) => {
        if (Date.now() - lastPrune > pruneInterval) {
            prune()
        }
        const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
            ?? c.req.header("cf-connecting-ip")?.trim()
            ?? c.req.header("x-real-ip")?.trim()
            ?? "127.0.0.1"

        const now = Date.now()
        const windowStart = now - windowMs

        const userRequests = (requests.get(ip) ?? []).filter(t => t > windowStart)
        if (userRequests.length >= max) {
            return c.json({
                error: "Too many requests. Please try again later.",
                status: 429
            }, 429)
        }

        const updated = [...userRequests, now]
        requests.set(ip, updated)

        const oldestRequest = updated[0] ?? now
        const resetTime = oldestRequest + windowMs

        c.header("X-RateLimit-Limit", String(max))
        c.header("X-RateLimit-Remaining", String(max - updated.length))
        c.header("X-RateLimit-Reset", String(Math.floor(resetTime / 1000)))

        await next()
    }
}
