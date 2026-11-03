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

    // 2. Check if solar_projects is empty; if so, seed from .json
    const countRes = await sql`SELECT count(*) FROM solar_projects`;
    const count = parseInt(countRes[0]?.count || "0", 10);

    if (count === 0) {
      const storeFile = path.join(process.cwd(), ".data", ".json");
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

    // 3. Ensure all admin_users from admin_store.json are seeded to DB if not present
    const userStoreFile = path.join(process.cwd(), ".data", "admin_store.json");
    if (fs.existsSync(userStoreFile)) {
      try {
        const store = JSON.parse(fs.readFileSync(userStoreFile, "utf-8"));
        if (Array.isArray(store.users)) {
          for (const u of store.users) {
            await sql`
              INSERT INTO admin_users (
                id, name, email, password_hash, role, permissions, status, phone, avatar, last_login, created_at, updated_at
              ) VALUES (
                ${u.id}, ${u.name}, ${u.email}, ${u.passwordHash}, ${u.role},
                ${JSON.stringify(u.permissions || [])}, ${u.status || "active"}, ${u.phone || ""},
                ${u.avatar || ""}, ${u.lastLogin ? new Date(u.lastLogin) : null},
                ${new Date(u.createdAt || Date.now())}, ${new Date(u.updatedAt || Date.now())}
              ) ON CONFLICT (id) DO NOTHING;
            `;
          }
        }
      } catch (userSyncErr) {
        console.warn("Auto-seed admin_users error:", userSyncErr);
      }
    }

    // 4. Sync latest DB admin_users back into admin_store.json so manual pgAdmin changes take effect
    try {
      const dbUsers = await sql`SELECT * FROM admin_users`;
      if (dbUsers && dbUsers.length > 0 && fs.existsSync(userStoreFile)) {
        const store = JSON.parse(fs.readFileSync(userStoreFile, "utf-8"));
        const mappedUsers = dbUsers.map((u: Record<string, unknown>) => {
          let perms: string[] = [];
          try {
            perms = typeof u.permissions === "string" ? JSON.parse(u.permissions as string) : ((u.permissions as string[]) || []);
          } catch {
            perms = [];
          }
          return {
            id: u.id as string,
            name: u.name as string,
            email: u.email as string,
            passwordHash: u.password_hash as string,
            role: u.role as string,
            permissions: perms,
            status: (u.status as string) || "active",
            phone: (u.phone as string) || "",
            avatar: (u.avatar as string) || "",
            lastLogin: u.last_login ? new Date(u.last_login as string | Date).toISOString() : null,
            createdAt: u.created_at ? new Date(u.created_at as string | Date).toISOString() : new Date().toISOString(),
            updatedAt: u.updated_at ? new Date(u.updated_at as string | Date).toISOString() : new Date().toISOString(),
          };
        });
        store.users = mappedUsers;
        try {
          fs.writeFileSync(userStoreFile, JSON.stringify(store, null, 2), "utf-8");
        } catch {
          // Read-only filesystem in Vercel
        }
      }
    } catch (dbSyncErr) {
      console.warn("Sync from DB admin_users error:", dbSyncErr);
    }

    initialized = true;
  } catch (err) {
    console.error("ensureDbInitialized error:", err);
  }
}
