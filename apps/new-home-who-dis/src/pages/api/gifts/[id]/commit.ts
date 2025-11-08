import type { APIRoute } from "astro"
import { db } from "../../../../db/index.js"
import { gifts, users, commitments } from "../../../../db/schema.js"
import { eq, sql, and } from "drizzle-orm"
import { getSessionIdFromCookie } from "../../../../lib/session.js"

/**
 * POST /api/gifts/[id]/commit
 * Commit to purchasing a gift
 */
export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id: giftId } = params

    if (!giftId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gift ID is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

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

    // Get the gift
    const giftResult = await db
      .select()
      .from(gifts)
      .where(eq(gifts.id, giftId))
      .limit(1)

    const gift = giftResult[0]
    if (!gift) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gift not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Check if already committed
    if (gift.isCommitted) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `This gift has already been committed by ${gift.committedBy}`,
          alreadyCommitted: true,
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Create commitment record
    const newCommitmentResult = await db
      .insert(commitments)
      .values({
        userId: user.id,
        giftId: gift.id,
        amount: gift.estimatedPrice,
        status: "active",
      })
      .returning()

    const newCommitment = newCommitmentResult[0]

    // Update gift as committed
    await db
      .update(gifts)
      .set({
        isCommitted: true,
        committedBy: user.pseudonym,
        committedAt: new Date(),
      })
      .where(eq(gifts.id, giftId))

    return new Response(
      JSON.stringify({
        success: true,
        commitment: {
          id: newCommitment?.id,
          giftId: gift.id,
          giftName: gift.name,
          amount: gift.estimatedPrice,
          committedBy: user.pseudonym,
          committedAt: new Date(),
        },
        message: `Successfully committed to "${gift.name}"!`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error committing to gift:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to commit to gift",
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
 * DELETE /api/gifts/[id]/commit
 * Cancel a gift commitment
 */
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const { id: giftId } = params

    if (!giftId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gift ID is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get user session
    const sessionId = getSessionIdFromCookie(request)
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No session found",
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
          error: "User not found",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Find the active commitment for this user and gift
    const commitmentResult = await db
      .select()
      .from(commitments)
      .where(
        sql`${commitments.userId} = ${user.id} AND ${commitments.giftId} = ${giftId} AND ${commitments.status} = 'active'`
      )
      .limit(1)

    const commitment = commitmentResult[0]
    if (!commitment) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Commitment not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Mark commitment as cancelled
    await db
      .update(commitments)
      .set({
        status: "cancelled",
      })
      .where(eq(commitments.id, commitment.id))

    // Update gift to be available again
    await db
      .update(gifts)
      .set({
        isCommitted: false,
        committedBy: null,
        committedAt: null,
      })
      .where(eq(gifts.id, giftId))

    // Get updated gift for response
    const updatedGiftResult = await db
      .select()
      .from(gifts)
      .where(eq(gifts.id, giftId))
      .limit(1)

    const updatedGift = updatedGiftResult[0]

    return new Response(
      JSON.stringify({
        success: true,
        gift: updatedGift,
        message: `Successfully cancelled commitment to "${updatedGift?.name}"`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error cancelling commitment:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to cancel commitment",
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
