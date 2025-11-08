import type { APIRoute } from "astro"
import { db } from "../../db/index.js"
import { gifts } from "../../db/schema.js"
import { eq } from "drizzle-orm"
import { isValidWishlistType, ValidationError } from "../../lib/validation.js"

export const GET: APIRoute = async ({ url }) => {
  try {
    const wishlistType = url.searchParams.get("type")

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
      const allGifts = await db
        .select()
        .from(gifts)
        .where(eq(gifts.wishlistType, wishlistType))

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
    }

    // No filter - return all gifts
    const allGifts = await db.select().from(gifts)

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
