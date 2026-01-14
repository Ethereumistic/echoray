// generateKeys.mjs
// Run with: node generateKeys.mjs
// Then copy the output to your Convex dashboard environment variables

import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { writeFileSync } from "fs";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

// Format private key with spaces instead of newlines
const formattedPrivateKey = privateKey.trimEnd().replace(/\n/g, " ");

// Write to a file for easy copying
const output = `
=== COPY THESE TO CONVEX DASHBOARD ===

JWT_PRIVATE_KEY:
"${formattedPrivateKey}"

JWKS:
${jwks}

=== INSTRUCTIONS ===
1. Go to https://dashboard.convex.dev
2. Select your "echoray" project  
3. Go to Settings -> Environment Variables
4. Delete the old JWT_PRIVATE_KEY if it exists
5. Add JWT_PRIVATE_KEY with the value above (including the quotes)
6. Add JWKS with the JSON above (no quotes needed)
`;

writeFileSync("convex-auth-keys.txt", output);
console.log("Keys written to convex-auth-keys.txt");
console.log("Open that file and copy the values to your Convex dashboard.");
