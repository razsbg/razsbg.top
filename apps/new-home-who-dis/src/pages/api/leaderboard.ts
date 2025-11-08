import type { APIRoute } from "astro"
import { db } from "../../db/index.js"
import { users, commitments } from "../../db/schema.js"
import { eq, sql } from "drizzle-orm"
import { getSessionIdFromCookie } from "../../lib/session.js"

/**
 * GET /api/leaderboard
 * Get leaderboard of users ranked by total commitment amounts
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // Get current user's session (optional - to highlight their row)
    const sessionId = getSessionIdFromCookie(request)
    let currentUserId: string | null = null

    if (sessionId) {
      const userResult = await db
        .select()
        .from(users)
        .where(sql`${users.sessionId} = ${sessionId}`)
        .limit(1)

      if (userResult.length > 0) {
        currentUserId = userResult[0]?.id || null
      }
    }

    // Query leaderboard: sum commitment amounts per user where status = 'active'
    const leaderboardData = await db
      .select({
        userId: commitments.userId,
        totalCommitted: sql<number>`CAST(SUM(${commitments.amount}) AS INTEGER)`,
        giftCount: sql<number>`CAST(COUNT(${commitments.id}) AS INTEGER)`,
      })
      .from(commitments)
      .where(sql`${commitments.status} = 'active'`)
      .groupBy(commitments.userId)
      .orderBy(sql`SUM(${commitments.amount}) DESC`)
      .limit(100)

    // Get user details for each user in leaderboard
    const userIds = leaderboardData.map((entry) => entry.userId)
    const userDetails = await db
      .select({
        id: users.id,
        pseudonym: users.pseudonym,
      })
      .from(users)
      .where(sql`${users.id} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`)

    // Map user details to leaderboard data
    const userDetailsMap = new Map(
      userDetails.map((user) => [user.id, user])
    )

    // Build leaderboard with ranks and user info
    const leaderboard = leaderboardData.map((entry, index) => {
      const user = userDetailsMap.get(entry.userId)
      return {
        rank: index + 1,
        userId: entry.userId,
        pseudonym: user?.pseudonym || "Unknown",
        totalCommitted: entry.totalCommitted,
        giftCount: entry.giftCount,
        isCurrentUser: entry.userId === currentUserId,
      }
    })

    // Find current user's position
    let currentUserRank = null
    if (currentUserId) {
      const userEntry = leaderboard.find((entry) => entry.userId === currentUserId)
      if (userEntry) {
        currentUserRank = userEntry.rank
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        leaderboard,
        currentUserRank,
        totalUsers: leaderboard.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch leaderboard",
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
