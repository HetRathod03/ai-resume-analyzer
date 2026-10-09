import mysql from "mysql2/promise";
import { env } from "./env";

let pool: mysql.Pool | null = null;

/** Returns the MySQL pool, or null when the DB is not configured / unavailable. */
export const getPool = () => pool;

export async function connectDb(): Promise<void> {
  if (!env.db.host) {
    console.log("DB_HOST not set -> running without MySQL (history disabled)");
    return;
  }
  try {
    const p = mysql.createPool({
      host: env.db.host,
      user: env.db.user,
      password: env.db.password,
      database: env.db.name,
    });
    await p.query(`CREATE TABLE IF NOT EXISTS analyses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_title VARCHAR(255) NOT NULL,
      score INT NOT NULL,
      result JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    pool = p;
    console.log("MySQL connected");
  } catch (err) {
    pool = null;
    console.error("MySQL connection failed -> history disabled:", (err as Error).message);
  }
}
