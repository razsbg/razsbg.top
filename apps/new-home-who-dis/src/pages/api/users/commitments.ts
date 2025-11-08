import type { APIRoute } from "astro"
import { db } from "../../../db/index.js"
import { users, gifts, commitments } from "../../../db/schema.js"
import { eq, sql } from "drizzle-orm"
import { getSessionIdFromCookie } from "../../../lib/session.js"

/**
 * GET /api/users/commitments
 * Get all commitments for the current user
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // Get user session
    const sessionId = getSessionIdFromCookie(request)
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No session found. Please create your identity first.",
          requiresIdentity: true,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get user from session
    const userResult = await db
      .select()
      .from(users)
      .where(sql`${users.sessionId} = ${sessionId}`)
      .limit(1)

    const user = userResult[0]
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found. Please create your identity first.",
          requiresIdentity: true,
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get all active commitments with gift details
    const userCommitments = await db
      .select({
        commitmentId: commitments.id,
        commitmentAmount: commitments.amount,
        commitmentStatus: commitments.status,
        committedAt: commitments.committedAt,
        giftId: gifts.id,
        giftName: gifts.name,
        giftDescription: gifts.description,
        giftPrice: gifts.estimatedPrice,
        giftCategory: gifts.category,
        giftPriority: gifts.priority,
        giftWishlistType: gifts.wishlistType,
        giftImageUrl: gifts.imageUrl,
      })
      .from(commitments)
      .innerJoin(gifts, eq(commitments.giftId, gifts.id))
      .where(sql`${commitments.userId} = ${user.id} AND ${commitments.status} = 'active'`)

    // Calculate total amount
    const totalAmount = userCommitments.reduce(
      (sum, c) => sum + c.commitmentAmount,
      0
    )

    // Group by wishlist type
    const grouped = {
      traditional: userCommitments.filter(c => c.giftWishlistType === "traditional"),
      receipt: userCommitments.filter(c => c.giftWishlistType === "receipt"),
      bandcamp: userCommitments.filter(c => c.giftWishlistType === "bandcamp"),
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          pseudonym: user.pseudonym,
        },
        commitments: userCommitments,
        grouped,
        stats: {
          total: userCommitments.length,
          totalAmount,
          byWishlist: {
            traditional: grouped.traditional.length,
            receipt: grouped.receipt.length,
            bandcamp: grouped.bandcamp.length,
          },
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
    console.error("Error fetching user commitments:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch commitments",
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
