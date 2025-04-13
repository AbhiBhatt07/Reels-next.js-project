import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // your config in /lib/auth.ts

// Handler for GET and POST requests
const handler = NextAuth(authOptions);

// Export both GET and POST methods for NextAuth
export { handler as GET, handler as POST };
