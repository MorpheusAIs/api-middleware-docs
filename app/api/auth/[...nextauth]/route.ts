import NextAuth, { AuthOptions, SessionStrategy, User as NextAuthUser, Account, Profile, Session, DefaultSession } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

// Function to decode JWT payload (basic implementation)
// NOTE: This is a basic decoder assuming standard JWT structure and no verification needed here.
// For production, consider using a robust library like 'jose'.
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

// Define a type for your backend API response
interface ApiLoginResponse {
  access_token: string;
  refresh_token: string;
  user_id?: string;
  email?: string;
}

// Extend the default NextAuth User type used internally during authorize
interface AuthorizeUser extends NextAuthUser {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// Extend the default JWT type stored in the cookie
interface ExtendedJWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number; // Store expiry timestamp (in seconds)
    userId: string; // Rename 'id' to avoid conflict with default JWT 'sub'/'id'
    error?: "RefreshAccessTokenError";
    email?: string | null;
}

// Extend the default Session type available client-side
interface ExtendedSession extends DefaultSession {
    user: { // Nest custom properties under user
      id: string;
      accessToken: string;
    } & DefaultSession["user"]; // Include default user properties (name, email, image)
    error?: "RefreshAccessTokenError"; // Optional: Propagate error to session
}


const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined, req): Promise<AuthorizeUser | null> {
        const backendUrl = process.env.BACKEND_API_URL || 'http://api.mor.org';

        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (!res.ok) {
            console.error(`[NextAuth Authorize] Login failed: ${res.status} ${res.statusText}`);
            try {
                const errorBody = await res.json();
                console.error("[NextAuth Authorize] Login error body:", errorBody);
                // Consider throwing an error with details if needed by NextAuth pages
                // throw new Error(errorBody.detail || 'Authentication failed');
            } catch {
                // Ignore if error body is not JSON
            }
            return null; // Indicate failure
          }

          const data: ApiLoginResponse = await res.json();
          console.log('[NextAuth Authorize] Backend Response Data:', data);

          if (data.access_token && data.refresh_token) {
             console.log('[NextAuth Authorize] Tokens received:', data.access_token ? 'Yes' : 'No', data.refresh_token ? 'Yes' : 'No');

            // Decode access token to get expiry
            const decoded = decodeJwtPayload(data.access_token);
            const expires = decoded?.exp;
            if (!expires) {
                 console.error("[NextAuth Authorize] Could not decode access token expiry.");
                 return null; // Cannot proceed without expiry
            }

            // Return the user object conforming to AuthorizeUser
            const user: AuthorizeUser = {
              id: data.user_id || "temp-id-" + Date.now(),
              email: data.email || credentials.email,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
            console.log('[NextAuth Authorize] Returning user object:', user);
            return user;
          } else {
              console.error("[NextAuth Authorize] Missing access_token or refresh_token in response.");
          }
        } catch (error) {
          console.error("[NextAuth Authorize] Error during authorization:", error);
          // Throwing an error or returning null will prevent the user from signing in
          return null;
        }
        console.log('[NextAuth Authorize] Reached end, returning null');
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    // Adjust user type here - remove AdapterUser
    async jwt({ token, user, account }: { token: JWT; user?: NextAuthUser | AuthorizeUser; account?: Account | null }): Promise<JWT> {
      console.log('[NextAuth JWT Callback] Fired. Account:', !!account, 'User:', !!user);
      let extendedToken = token as ExtendedJWT; // Assert token type

      // Initial sign in: User object from authorize is available
      if (account && user) {
         const authorizeUser = user as AuthorizeUser;
         console.log('[NextAuth JWT Callback] Initial sign in. User object received:', authorizeUser);

         const decoded = decodeJwtPayload(authorizeUser.accessToken);
         const expires = decoded?.exp;

         if (!expires) {
              console.error("[NextAuth JWT Callback] Could not decode access token expiry on initial sign in.");
              extendedToken.error = "RefreshAccessTokenError";
              return extendedToken;
         }

         extendedToken.accessToken = authorizeUser.accessToken;
         extendedToken.refreshToken = authorizeUser.refreshToken;
         extendedToken.accessTokenExpires = expires;
         extendedToken.userId = authorizeUser.id;
         extendedToken.email = authorizeUser.email;
         extendedToken.error = undefined;
         console.log('[NextAuth JWT Callback] Initial token created/updated:', extendedToken);
         return extendedToken;
       }

       // Subsequent calls: Check token validity and refresh if needed
       const bufferSeconds = 60;
       if (extendedToken.accessTokenExpires && (extendedToken.accessTokenExpires * 1000 > Date.now() + bufferSeconds * 1000)) {
           console.log("[NextAuth JWT Callback] Access token still valid.");
           return extendedToken; // Return existing valid token
       }

       // Access token needs refresh or is missing expiry
       console.log("[NextAuth JWT Callback] Access token expired or nearing expiry. Attempting refresh.");
       if (!extendedToken.refreshToken) {
           console.error("[NextAuth JWT Callback] No refresh token available.");
           extendedToken.error = "RefreshAccessTokenError";
           return extendedToken; // Cannot refresh
       }

       try {
         const backendUrl = process.env.BACKEND_API_URL || 'http://api.mor.org';
         const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: extendedToken.refreshToken }),
          });

          if (!response.ok) {
            console.error(`[NextAuth JWT Callback] Refresh token request failed: ${response.status} ${response.statusText}`);
            const errorBody = await response.json().catch(() => ({})); // Attempt to parse error
            console.error("[NextAuth JWT Callback] Refresh error body:", errorBody);
            extendedToken.error = "RefreshAccessTokenError";
            return extendedToken;
          }

          const refreshedTokens: ApiLoginResponse = await response.json();
          console.log("[NextAuth JWT Callback] Tokens refreshed successfully.");

          const decoded = decodeJwtPayload(refreshedTokens.access_token);
          const newExpires = decoded?.exp;

          if (!newExpires) {
            console.error("[NextAuth JWT Callback] Could not decode *new* access token expiry after refresh.");
            extendedToken.error = "RefreshAccessTokenError";
            return extendedToken;
          }

          // Update token with new values
          extendedToken.accessToken = refreshedTokens.access_token;
          extendedToken.refreshToken = refreshedTokens.refresh_token;
          extendedToken.accessTokenExpires = newExpires;
          extendedToken.error = undefined; // Clear error on successful refresh

          console.log("[NextAuth JWT Callback] Token updated after successful refresh:", extendedToken);
          return extendedToken;

        } catch (error) {
          console.error("[NextAuth JWT Callback] Error refreshing access token:", error);
          extendedToken.error = "RefreshAccessTokenError";
          return extendedToken;
        }
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
        let extendedSession = session as ExtendedSession;
        let extendedToken = token as ExtendedJWT;

        // Ensure the user object exists and initialize with necessary fields
        if (!extendedSession.user) {
            // Initialize user object ensuring required fields (id, accessToken, email) are present
            extendedSession.user = {
                id: extendedToken.userId, // Use userId from token
                email: extendedToken.email || '', // Use email from token
                accessToken: extendedToken.accessToken, // Ensure accessToken is added here
                // name and image are optional in DefaultSession, so they are handled
            };
        } else {
            // If user exists, ensure all required fields are populated from token
            extendedSession.user.id = extendedToken.userId;
            extendedSession.user.email = extendedToken.email || '';
            extendedSession.user.accessToken = extendedToken.accessToken;
            // session.user.name = extendedToken.name; // Optional: If name is in JWT
            // session.user.image = extendedToken.picture; // Optional: If picture is in JWT
        }

        // Propagate error if refresh failed
        if (extendedToken.error) {
            extendedSession.error = extendedToken.error;
             // Optionally clear the accessToken if refresh failed, forcing logout on client
             // delete extendedSession.user.accessToken;
        }

        console.log("[NextAuth Session Callback] Populated session:", extendedSession);
        return extendedSession;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 