import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  aiModel: process.env.AI_MODEL || "gemini-flash-latest",
  db: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "resume_analyzer",
  },
};
