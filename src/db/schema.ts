import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("sub_admin").notNull(), // super_admin | operations | solar_consultant | support
  permissions: text("permissions").notNull().default("[]"), // JSON string array of permissions
  status: varchar("status", { length: 20 }).default("active").notNull(), // active | inactive
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consultationRequests = pgTable("consultation_requests", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  propertyType: varchar("property_type", { length: 100 }).notNull(),
  interestedIn: varchar("interested_in", { length: 100 }).notNull(),
  averageElectricityBill: varchar("average_electricity_bill", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending | contacted | quoted | scheduled | installed | rejected
  assignedTo: varchar("assigned_to", { length: 255 }),
  adminNotes: text("admin_notes"),
  estimatedKw: varchar("estimated_kw", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const solarProjects = pgTable("solar_projects", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Residential | Commercial | Industrial
  capacity: varchar("capacity", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  client: varchar("client", { length: 255 }).notNull(),
  completionYear: varchar("completion_year", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).default("Completed").notNull(),
  image: text("image"),
  description: text("description"),
  impact: text("impact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adminId: varchar("admin_id", { length: 255 }).notNull(),
  adminName: varchar("admin_name", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type NewConsultationRequest = typeof consultationRequests.$inferInsert;
export type SolarProject = typeof solarProjects.$inferSelect;
export type NewSolarProject = typeof solarProjects.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;


