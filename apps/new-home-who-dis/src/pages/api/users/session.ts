import type { APIRoute } from "astro"
import { db } from "../../../db/index.js"
import { users, commitments } from "../../../db/schema.js"
import { eq, sql } from "drizzle-orm"
import {
  generateUniquePseudonym,
  generateSessionId,
  hashIpAddress,
} from "../../../lib/pseudonym.js"
import {
  getSessionIdFromCookie,
  getClientIp,
  createSessionResponse,
} from "../../../lib/session.js"

/**
 * POST /api/users/session
 * Create a new anonymous user session
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Get client IP for tracking (hashed)
    const clientIp = getClientIp(request)
    const ipHash = hashIpAddress(clientIp)

    // Generate session ID
    const sessionId = generateSessionId()

    // Get existing pseudonyms to ensure uniqueness
    const existingUsers = await db
      .select({ pseudonym: users.pseudonym })
      .from(users)
    const existingPseudonyms = existingUsers.map((u) => u.pseudonym)

    // Generate unique pseudonym
    const pseudonym = generateUniquePseudonym(existingPseudonyms)

    // Create user in database
    const newUsers = await db
      .insert(users)
      .values({
        pseudonym,
        sessionId,
        ipHash,
      })
      .returning()

    const newUser = newUsers[0]
    if (!newUser) {
      throw new Error("Failed to create user")
    }

    return createSessionResponse(
      {
        success: true,
        user: {
          id: newUser.id,
          pseudonym: newUser.pseudonym,
          sessionId: newUser.sessionId,
          createdAt: newUser.createdAt,
        },
      },
      sessionId,
      201
    )
  } catch (error) {
    console.error("Error creating user session:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}

/**
 * GET /api/users/session
 * Get current user session or return null if not found
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // Check for existing session
    const sessionId = getSessionIdFromCookie(request)

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          success: true,
          user: null,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Find user by session ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.sessionId, sessionId))
      .limit(1)

    if (!user) {
      return new Response(
        JSON.stringify({
          success: true,
          user: null,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Update last active timestamp
    await db
      .update(users)
      .set({ lastActive: new Date() })
      .where(eq(users.id, user.id))

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          pseudonym: user.pseudonym,
          sessionId: user.sessionId,
          createdAt: user.createdAt,
          lastActive: new Date(),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error getting user session:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}

/**
 * PUT /api/users/session
 * Regenerate pseudonym for existing user
 */
export const PUT: APIRoute = async ({ request }) => {
  try {
    // Check for existing session
    const sessionId = getSessionIdFromCookie(request)

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No active session found",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Find user by session ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.sessionId, sessionId))
      .limit(1)

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Session not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Check if user has any gift commitments
    const userCommitments = await db
      .select()
      .from(commitments)
      .where(sql`${commitments.userId} = ${user.id}`)
      .limit(1)

    if (userCommitments.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cannot change identity after committing to gifts",
          reason: "commitment_exists",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get existing pseudonyms (excluding current user)
    const existingUsers = await db
      .select({ pseudonym: users.pseudonym })
      .from(users)
      .where(eq(users.id, user.id))

    const existingPseudonyms = existingUsers
      .map((u) => u.pseudonym)
      .filter((p) => p !== user.pseudonym)

    // Generate new unique pseudonym
    const newPseudonym = generateUniquePseudonym(existingPseudonyms)

    // Update user
    const updatedUsers = await db
      .update(users)
      .set({
        pseudonym: newPseudonym,
        lastActive: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning()

    const updatedUser = updatedUsers[0]
    if (!updatedUser) {
      throw new Error("Failed to update user")
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: updatedUser.id,
          pseudonym: updatedUser.pseudonym,
          sessionId: updatedUser.sessionId,
          createdAt: updatedUser.createdAt,
          lastActive: updatedUser.lastActive,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error regenerating pseudonym:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
}
