import type { Context, Next } from 'hono'

type RateLimiterOptions = {
    windowMs?: number
    max?: number
}

export const rateLimiter = (options: RateLimiterOptions = {}) => {
    let requests = new Map<string, number[]>()

    const windowMs = options.windowMs ?? 15 * 60 * 1000
    const max = options.max ?? 100

    const prune = () => {
        const now = Date.now()
        const windowStart = now - windowMs

        requests = new Map<string, number[]>(
            Array.from(requests.entries())
                .map(([ip, ts]): [string, number[]] => [ip, ts.filter(t => t > windowStart)])
                .filter(([, ts]) => ts.length > 0)
        )
    }

    setInterval(prune, 5 * 60 * 1000)

    return async (c: Context, next: Next) => {
        const ip = c.req.header("x-forwarded-for")?.split(",")[0]
            ?? c.req.header("cf-connecting-ip")
            ?? "unknown"

        const now = Date.now()
        const windowStart = now - windowMs

        const userRequests =
        (requests.get(ip) ?? []).filter(t => t > windowStart)

        if (userRequests.length >= max) {
        return c.json({
            error: "🚦 Too many requests. Please try again later.",
            retryAfter: Math.ceil(windowMs / 1000)
        }, 429)
        }

        const updated = [...userRequests, now]
        requests.set(ip, updated)

        c.header("X-RateLimit-Limit", String(max))
        c.header("X-RateLimit-Remaining", String(max - updated.length))
        c.header("X-RateLimit-Reset", new Date(now + windowMs).toISOString())

        await next()
    }
}
