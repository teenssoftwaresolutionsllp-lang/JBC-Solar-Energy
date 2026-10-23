import { getRawSql } from "./index";
import fs from "fs";
import path from "path";

let initialized = false;

export async function ensureDbInitialized() {
  if (initialized) return;
  const sql = getRawSql();
  if (!sql) return;

  try {
    // 1. Create tables if not exist
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'sub_admin' NOT NULL,
        permissions TEXT DEFAULT '[]' NOT NULL,
        status VARCHAR(20) DEFAULT 'active' NOT NULL,
        phone VARCHAR(50),
        avatar TEXT,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        interested_in VARCHAR(100) NOT NULL,
        average_electricity_bill VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        assigned_to VARCHAR(255),
        admin_notes TEXT,
        estimated_kw VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS solar_projects (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        capacity VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        client VARCHAR(255) NOT NULL,
        completion_year VARCHAR(20) NOT NULL,
        status VARCHAR(50) DEFAULT 'Completed' NOT NULL,
        image TEXT,
        description TEXT,
        impact TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        admin_id VARCHAR(255) NOT NULL,
        admin_name VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // 2. Check if solar_projects is empty; if so, seed from admin_store.json
    const countRes = await sql`SELECT count(*) FROM solar_projects`;
    const count = parseInt(countRes[0]?.count || "0", 10);

    if (count === 0) {
      const storeFile = path.join(process.cwd(), ".data", "admin_store.json");
      if (fs.existsSync(storeFile)) {
        try {
          const store = JSON.parse(fs.readFileSync(storeFile, "utf-8"));
          if (Array.isArray(store.projects)) {
            for (const p of store.projects) {
              await sql`
                INSERT INTO solar_projects (
                  id, title, category, capacity, location, client, completion_year, status, image, description, impact, created_at
                ) VALUES (
                  ${p.id}, ${p.title}, ${p.category}, ${p.capacity}, ${p.location}, ${p.client || "Client"},
                  ${p.completionYear || "2025"}, ${p.status || "Completed"}, ${p.image || "/images/image 7.png"},
                  ${p.description || ""}, ${p.impact || ""}, ${new Date(p.createdAt || Date.now())}
                ) ON CONFLICT (id) DO NOTHING;
              `;
            }
          }
        } catch (seedErr) {
          console.warn("Auto-seed error:", seedErr);
        }
      }
    }

    initialized = true;
  } catch (err) {
    console.error("ensureDbInitialized error:", err);
  }
}
