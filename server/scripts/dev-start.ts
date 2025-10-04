// server/scripts/dev-start.ts
import dotenv from "dotenv";
import path from "path";

// Load local .env for development only
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Start server
import "../src/server";
