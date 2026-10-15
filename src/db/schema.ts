import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const consultationRequests = pgTable("consultation_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  propertyType: varchar("property_type", { length: 100 }).notNull(),
  interestedIn: varchar("interested_in", { length: 100 }).notNull(),
  averageElectricityBill: varchar("average_electricity_bill", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type NewConsultationRequest = typeof consultationRequests.$inferInsert;
