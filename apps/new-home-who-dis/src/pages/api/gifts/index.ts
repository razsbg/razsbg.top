import type { APIRoute } from "astro"
import { db } from "../../../db/index.js"
import { gifts } from "../../../db/schema.js"
import { sql } from "drizzle-orm"

/**
 * GET /api/gifts
 * Fetch all gifts with optional filters
 * 
 * Query params:
 * - wishlistType: 'traditional' | 'receipt' | 'bandcamp'
 * - category: string
 * - priority: 'essential' | 'nice-to-have' | 'luxury' | 'digital'
 * - available: 'true' | 'false' (filter by commitment status)
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const wishlistType = url.searchParams.get("wishlistType")
    const category = url.searchParams.get("category")
    const priority = url.searchParams.get("priority")
    const availableOnly = url.searchParams.get("available") === "true"

    // Build WHERE clause
    const conditions = []
    
    if (wishlistType) {
      conditions.push(sql`${gifts.wishlistType} = ${wishlistType}`)
    }
    
    if (category) {
      conditions.push(sql`${gifts.category} = ${category}`)
    }
    
    if (priority) {
      conditions.push(sql`${gifts.priority} = ${priority}`)
    }
    
    if (availableOnly) {
      conditions.push(sql`${gifts.isCommitted} = false`)
    }

    // Execute query with filters
    let allGifts
    if (conditions.length > 0) {
      const whereClause = conditions.reduce((acc, condition) => 
        acc ? sql`${acc} AND ${condition}` : condition
      )
      allGifts = await db.select().from(gifts).where(whereClause)
    } else {
      allGifts = await db.select().from(gifts)
    }

    // Group by wishlist type for easier frontend consumption
    const groupedGifts = {
      traditional: allGifts.filter(g => g.wishlistType === "traditional"),
      receipt: allGifts.filter(g => g.wishlistType === "receipt"),
      bandcamp: allGifts.filter(g => g.wishlistType === "bandcamp"),
    }

    // Calculate stats
    const stats = {
      total: allGifts.length,
      committed: allGifts.filter(g => g.isCommitted).length,
      available: allGifts.filter(g => !g.isCommitted).length,
      byWishlist: {
        traditional: groupedGifts.traditional.length,
        receipt: groupedGifts.receipt.length,
        bandcamp: groupedGifts.bandcamp.length,
      },
    }

    return new Response(
      JSON.stringify({
        success: true,
        gifts: allGifts,
        grouped: groupedGifts,
        stats,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching gifts:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch gifts",
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
