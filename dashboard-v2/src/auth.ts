import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import pg from "pg"
import { authConfig } from "./auth.config"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PostgresAdapter(pool),
  session: {
    strategy: "jwt", 
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    ...authConfig.providers,
    // Add any database-specific provider overrides here if needed
  ]
})
