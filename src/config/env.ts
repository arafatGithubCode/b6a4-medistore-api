import "dotenv/config";

// Ensure DATABASE_URL is defined
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Port
const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT is not defined in environment variables");
}

export { DATABASE_URL, PORT };
