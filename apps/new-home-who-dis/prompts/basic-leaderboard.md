Implement a basic leaderboard feature that displays users ranked by their total gift commitment amounts. Requirements:

1. Database:

   - Use existing "commitments" table (no schema changes needed)
   - Query should sum commitment amounts per user where status = 'active'
   - Add database index on commitments(user_id, status) for query performance if not already present

2. Backend Implementation:

   - Create API endpoint: GET /leaderboard
   - Query logic: SELECT user_id, SUM(amount) as total_committed FROM commitments WHERE status = 'active' GROUP BY user_id ORDER BY total_committed DESC
   - Return top 100 users with their rank, user info, and total committed amount
   - Include endpoint to get current user's position in leaderboard

3. Frontend Components:

   - Build responsive leaderboard UI component displaying:
     - Rank number
     - Username
     - Total committed amount
     - Highlight current user's row
   - No filtering, no real-time updates needed
   - Simple, clean design showing the commitment leaderboard

4. Integration:
   - Connect to existing user authentication to identify current user
   - Follow existing code patterns and TypeScript conventions
   - Ensure proper error handling for edge cases (users with no commitments, etc.)

No caching layer needed. No testing required. Focus on clean, straightforward implementation using our existing commitments data.
