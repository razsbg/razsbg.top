/**
 * Session management utilities for anonymous users
 */

const SESSION_COOKIE_NAME = "gift_session_id"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Get session ID from cookies
 */
export function getSessionIdFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(";").map((c) => c.trim())
  const sessionCookie = cookies.find((c) =>
    c.startsWith(`${SESSION_COOKIE_NAME}=`)
  )

  if (!sessionCookie) return null

  return sessionCookie.split("=")[1] || null
}

/**
 * Create a session cookie header
 */
export function createSessionCookie(sessionId: string): string {
  return `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`
}

/**
 * Get client IP address from request
 * Handles various proxy headers
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]
    return firstIp ? firstIp.trim() : "unknown"
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to remote address (not available in most serverless environments)
  return "unknown"
}

/**
 * Session data structure
 */
export interface UserSession {
  sessionId: string
  pseudonym: string
  userId: string
  createdAt: Date
  lastActive: Date
}

/**
 * Create session response with cookie
 */
export function createSessionResponse(
  data: unknown,
  sessionId: string,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": createSessionCookie(sessionId),
    },
  })
}
