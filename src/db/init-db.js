const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

const connectionString = 'postgresql://postgres:7032@localhost:5433/jbc_solar';
console.log('Connecting to:', connectionString);
const sql = postgres(connectionString);

async function initDb() {
  try {
    console.log('1. Creating tables if not exist...');
    
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

    console.log('Tables created successfully!');

    // Read existing store
    const storePath = path.join(process.cwd(), '.data', 'admin_store.json');
    if (fs.existsSync(storePath)) {
      console.log('2. Reading data from admin_store.json...');
      const raw = fs.readFileSync(storePath, 'utf8');
      const store = JSON.parse(raw);

      // Check projects count in DB
      const existingProjects = await sql`SELECT count(*) FROM solar_projects`;
      if (parseInt(existingProjects[0].count, 10) === 0 && store.projects) {
        console.log(`Seeding ${store.projects.length} solar projects...`);
        for (const p of store.projects) {
          await sql`
            INSERT INTO solar_projects (
              id, title, category, capacity, location, client, completion_year, status, image, description, impact, created_at
            ) VALUES (
              ${p.id}, ${p.title}, ${p.category}, ${p.capacity}, ${p.location}, ${p.client || 'Client'},
              ${p.completionYear || '2025'}, ${p.status || 'Completed'}, ${p.image || ''},
              ${p.description || ''}, ${p.impact || ''}, ${new Date(p.createdAt || Date.now())}
            ) ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              category = EXCLUDED.category,
              capacity = EXCLUDED.capacity,
              location = EXCLUDED.location,
              client = EXCLUDED.client,
              completion_year = EXCLUDED.completion_year,
              status = EXCLUDED.status,
              image = EXCLUDED.image,
              description = EXCLUDED.description,
              impact = EXCLUDED.impact;
          `;
        }
      }

      // Check admin_users count in DB
      const existingUsers = await sql`SELECT count(*) FROM admin_users`;
      if (parseInt(existingUsers[0].count, 10) === 0 && store.users) {
        console.log(`Seeding ${store.users.length} admin users...`);
        for (const u of store.users) {
          await sql`
            INSERT INTO admin_users (
              id, name, email, password_hash, role, permissions, status, phone, avatar, last_login, created_at, updated_at
            ) VALUES (
              ${u.id}, ${u.name}, ${u.email}, ${u.passwordHash}, ${u.role},
              ${JSON.stringify(u.permissions || [])}, ${u.status || 'active'}, ${u.phone || ''},
              ${u.avatar || ''}, ${u.lastLogin ? new Date(u.lastLogin) : null},
              ${new Date(u.createdAt || Date.now())}, ${new Date(u.updatedAt || Date.now())}
            ) ON CONFLICT (id) DO NOTHING;
          `;
        }
      }

      // Check consultation_requests count in DB
      const existingLeads = await sql`SELECT count(*) FROM consultation_requests`;
      if (parseInt(existingLeads[0].count, 10) === 0 && store.leads) {
        console.log(`Seeding ${store.leads.length} leads...`);
        for (const l of store.leads) {
          await sql`
            INSERT INTO consultation_requests (
              id, full_name, phone, email, location, property_type, interested_in,
              average_electricity_bill, message, status, assigned_to, admin_notes, estimated_kw, created_at, updated_at
            ) VALUES (
              ${l.id}, ${l.fullName}, ${l.phone}, ${l.email}, ${l.location}, ${l.propertyType},
              ${l.interestedIn}, ${l.averageElectricityBill}, ${l.message}, ${l.status || 'pending'},
              ${l.assignedTo || null}, ${l.adminNotes || null}, ${l.estimatedKw || null},
              ${new Date(l.createdAt || Date.now())}, ${new Date(l.updatedAt || Date.now())}
            ) ON CONFLICT (id) DO NOTHING;
          `;
        }
      }

      // Check audit_logs count in DB
      const existingLogs = await sql`SELECT count(*) FROM audit_logs`;
      if (parseInt(existingLogs[0].count, 10) === 0 && store.auditLogs) {
        console.log(`Seeding ${store.auditLogs.length} audit logs...`);
        for (const a of store.auditLogs) {
          await sql`
            INSERT INTO audit_logs (
              id, admin_id, admin_name, action, details, created_at
            ) VALUES (
              ${a.id}, ${a.adminId}, ${a.adminName}, ${a.action}, ${a.details}, ${new Date(a.createdAt || Date.now())}
            ) ON CONFLICT (id) DO NOTHING;
          `;
        }
      }
    }

    const tables = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;
    `;
    console.log('3. Verified Tables in public schema:');
    tables.forEach(t => console.log(' - ' + t.table_name));

    const projRows = await sql`SELECT id, title, category, capacity FROM solar_projects`;
    console.log('4. Projects in solar_projects table:', projRows);

  } catch (err) {
    console.error('initDb error:', err);
  } finally {
    await sql.end();
  }
}

initDb();
