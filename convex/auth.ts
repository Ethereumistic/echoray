import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Convex Auth configuration for Echoray
 * 
 * Currently configured with:
 * - Email/Password authentication
 * 
 * Future additions can include:
 * - OAuth providers (Google, GitHub, etc.)
 * - Magic links / OTP
 */

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [Password],
});
