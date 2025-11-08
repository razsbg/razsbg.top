import type { APIRoute } from "astro"
import { db } from "../../../db/index.js"
import { gifts } from "../../../db/schema.js"
import { eq } from "drizzle-orm"

/**
 * GET /api/gifts/[id]
 * Fetch a single gift by ID
 */
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params

    if (!id) {
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

    const gift = await db
      .select()
      .from(gifts)
      .where(eq(gifts.id, id))
      .limit(1)

    if (!gift || gift.length === 0) {
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

    return new Response(
      JSON.stringify({
        success: true,
        gift: gift[0],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching gift:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch gift",
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
