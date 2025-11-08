/**
 * Simple authentication utilities for protecting test/admin routes
 */

/**
 * Check HTTP Basic Auth credentials
 * Returns true if authenticated, false otherwise
 */
export function checkBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  try {
    // Extract and decode base64 credentials
    const base64Credentials = authHeader.substring(6)
    const credentials = atob(base64Credentials)
    const [_username, password] = credentials.split(':')

    // Check against environment variable
    const expectedPassword = import.meta.env.TEST_PASSWORD || 'super-secret-password1'
    
    // Username can be anything, we only check password
    return password === expectedPassword
  } catch (error) {
    console.error('Error parsing auth header:', error)
    return false
  }
}

/**
 * Create an unauthorized response that prompts for basic auth
 */
export function createUnauthorizedResponse(realm: string = 'Protected Area'): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}"`,
      'Content-Type': 'text/plain',
    },
  })
}

/**
 * Check query parameter auth (alternative method)
 * Returns true if authenticated via query param
 */
export function checkQueryAuth(url: URL): boolean {
  const password = url.searchParams.get('password')
  const expectedPassword = import.meta.env.TEST_PASSWORD || 'super-secret-password1'
  
  return password === expectedPassword
}
