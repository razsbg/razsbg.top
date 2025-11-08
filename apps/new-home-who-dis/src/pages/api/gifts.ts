import type { APIRoute } from "astro"
import { db } from "../../db/index"
import { gifts } from "../../db/schema"
import { eq } from "drizzle-orm"
import { isValidWishlistType, ValidationError } from "../../lib/validation"

export const GET: APIRoute = async ({ url }) => {
  try {
    const wishlistType = url.searchParams.get("type")

    let query = db.select().from(gifts)

    // Filter by wishlist type if provided
    if (wishlistType) {
      // Validate wishlist type
      if (!isValidWishlistType(wishlistType)) {
        throw new ValidationError(
          `Invalid wishlist type: "${wishlistType}". Must be one of: traditional, receipt, bandcamp`,
          "type",
          wishlistType,
          ["traditional", "receipt", "bandcamp"]
        )
      }
      query = query.where(eq(gifts.wishlistType, wishlistType))
    }

    const allGifts = await query

    return new Response(
      JSON.stringify({
        success: true,
        count: allGifts.length,
        gifts: allGifts,
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
    
    // Handle validation errors with 400 status
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({
          success: false,
          ...error.toJSON(),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Handle other errors with 500 status
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
