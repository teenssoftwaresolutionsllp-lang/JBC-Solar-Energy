import fs from "fs";
import path from "path";
import crypto from "crypto";
import { hashPassword } from "./admin-crypto";
import {
  AdminUserRecord,
  SafeAdminUser,
  ConsultationLeadRecord,
  SolarProjectRecord,
  AuditLogRecord,
  DashboardStats,
  AdminRole,
} from "./admin-types";
import { projectsData } from "@/data/projects";
import { getDb } from "@/db";
import { solarProjects, adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDbInitialized } from "@/db/init";

interface StoreData {
  users: AdminUserRecord[];
  leads: ConsultationLeadRecord[];
  projects: SolarProjectRecord[];
  auditLogs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "admin_store.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialStore(): StoreData {
  const now = new Date().toISOString();

  // Pre-seed default Super Admin and Subadmins
  const users: AdminUserRecord[] = [
    {
      id: "usr-super-admin-1",
      name: "Admin User",
      email: "admin@jbcsolar.com",
      passwordHash: hashPassword("Admin@123"),
      role: "super_admin",
      permissions: ["*"],
      status: "active",
      phone: "+91 9100024222",
      avatar: "AU",
      lastLogin: now,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: "usr-subadmin-ops-2",
      name: "Rajiv Sharma",
      email: "rajiv.s@jbcsolar.com",
      passwordHash: hashPassword("Subadmin@123"),
      role: "operations",
      permissions: [
        "leads:read",
        "leads:write",
        "projects:manage",
        "analytics:view",
      ],
      status: "active",
      phone: "+91 9849012345",
      avatar: "RS",
      lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: "usr-subadmin-consultant-3",
      name: "Priya Patel",
      email: "priya.p@jbcsolar.com",
      passwordHash: hashPassword("Subadmin@123"),
      role: "solar_consultant",
      permissions: ["leads:read", "leads:write", "analytics:view"],
      status: "active",
      phone: "+91 9876543210",
      avatar: "PP",
      lastLogin: new Date(Date.now() - 5 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: now,
    },
  ];

  // Pre-seed realistic solar consultation leads
  const leads: ConsultationLeadRecord[] = [
    {
      id: "lead-001",
      fullName: "Rameshwar Rao",
      phone: "+91 9440123456",
      email: "rameshwar.rao@gmail.com",
      location: "Hyderabad, Telangana",
      propertyType: "Residential",
      interestedIn: "Rooftop Solar with Net Metering",
      averageElectricityBill: "₹6,500 / month",
      message: "Interested in installing a 7 kW grid-tied solar system for our 3-floor villa to cut summer AC bills.",
      status: "pending",
      assignedTo: "usr-subadmin-consultant-3",
      assignedAdminName: "Priya Patel",
      adminNotes: "Client requested site survey on Saturday morning.",
      estimatedKw: "7 kW",
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      updatedAt: now,
    },
    {
      id: "lead-002",
      fullName: "Modern Agro Cold Storage (Anand Patel)",
      phone: "+91 9829011223",
      email: "anand@moderncoldstorage.in",
      location: "Jalor, Rajasthan",
      propertyType: "Commercial",
      interestedIn: "Commercial Solar Rooftop System",
      averageElectricityBill: "₹65,000 / month",
      message: "We have 15,000 sq ft industrial shed roof. Seeking 100kW rooftop installation to lower peak daytime refrigeration costs.",
      status: "contacted",
      assignedTo: "usr-subadmin-ops-2",
      assignedAdminName: "Rajiv Sharma",
      adminNotes: "Contacted director. Feasibility report and ROI calculation sent via email.",
      estimatedKw: "100 kW",
      createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
      updatedAt: now,
    },
    {
      id: "lead-003",
      fullName: "Sterling Polymers Pvt Ltd",
      phone: "+91 9848099887",
      email: "procurement@sterlingpolymers.com",
      location: "Secunderabad, Telangana",
      propertyType: "Industrial",
      interestedIn: "Industrial Microgrid & Solar",
      averageElectricityBill: "₹1,80,000 / month",
      message: "Looking for 250 kW high-voltage captive solar plant. Require complete EPC turnkey delivery with DISCOM net metering sanction.",
      status: "quoted",
      assignedTo: "usr-super-admin-1",
      assignedAdminName: "Admin User",
      adminNotes: "Formal ₹1.15 Cr proposal submitted. DISCOM load sanction letter received.",
      estimatedKw: "250 kW",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: "lead-004",
      fullName: "Kishan Choudhary",
      phone: "+91 9784055667",
      email: "kishan.choudhary@farmenergy.com",
      location: "Bhinmal, Rajasthan",
      propertyType: "Agricultural",
      interestedIn: "Solar Water Pumping System",
      averageElectricityBill: "₹9,500 / month",
      message: "Need 10 HP solar submersible water pump under PM-KUSUM subsidy scheme for farm irrigation.",
      status: "scheduled",
      assignedTo: "usr-subadmin-consultant-3",
      assignedAdminName: "Priya Patel",
      adminNotes: "Field survey scheduled for October 18th.",
      estimatedKw: "10 HP",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: "lead-005",
      fullName: "Cyber Towers Facility Mgmt",
      phone: "+91 9121044332",
      email: "admin@cybertowers-hyd.org",
      location: "HITEC City, Hyderabad",
      propertyType: "Commercial",
      interestedIn: "Solar Carport & Rooftop",
      averageElectricityBill: "₹3,40,000 / month",
      message: "Phase 1: 500 kW installation completed and commissioned with smart IoT generation telemetry.",
      status: "installed",
      assignedTo: "usr-subadmin-ops-2",
      assignedAdminName: "Rajiv Sharma",
      adminNotes: "Commissioning certificate signed. 25-year performance warranty active.",
      estimatedKw: "500 kW",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: "lead-006",
      fullName: "Dr. Vikram Seth",
      phone: "+91 9988776655",
      email: "vikram.seth@apollohealth.org",
      location: "Banjara Hills, Hyderabad",
      propertyType: "Residential",
      interestedIn: "Hybrid Solar with Battery Backup",
      averageElectricityBill: "₹14,000 / month",
      message: "Need 12 kW solar with 15 kWh lithium battery backup for critical medical refrigeration equipment at private clinic.",
      status: "pending",
      assignedTo: "usr-subadmin-consultant-3",
      assignedAdminName: "Priya Patel",
      adminNotes: "New inquiry from website consultation form.",
      estimatedKw: "12 kW",
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      updatedAt: now,
    },
  ];

  // Pre-seed projects from existing website project portfolio
  const projects: SolarProjectRecord[] = projectsData.map((p, index) => ({
    id: p.id || `proj-${index + 1}`,
    title: p.title,
    category: p.category,
    capacity: p.capacity,
    location: p.location,
    client: p.category === "Residential" ? "Private Homeowner" : "Commercial Client",
    completionYear: p.completionYear,
    status: "Completed",
    image: p.image,
    description: p.description,
    impact: p.impact,
    createdAt: new Date(Date.now() - (index + 1) * 7 * 86400000).toISOString(),
  }));

  const auditLogs: AuditLogRecord[] = [
    {
      id: "log-001",
      adminId: "usr-super-admin-1",
      adminName: "Admin User",
      action: "SYSTEM_INITIALIZED",
      details: "JBC Solar Admin Suite initialized with enterprise role-based security.",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "log-002",
      adminId: "usr-super-admin-1",
      adminName: "Admin User",
      action: "SUBADMIN_CREATED",
      details: "Created subadmin account for Rajiv Sharma with Operations role.",
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: "log-003",
      adminId: "usr-super-admin-1",
      adminName: "Admin User",
      action: "SUBADMIN_CREATED",
      details: "Created subadmin account for Priya Patel with Solar Consultant role.",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "log-004",
      adminId: "usr-subadmin-ops-2",
      adminName: "Rajiv Sharma",
      action: "LEAD_STATUS_UPDATED",
      details: "Updated inquiry from Modern Agro Cold Storage to 'Contacted'.",
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ];

  return { users, leads, projects, auditLogs };
}

function readStore(): StoreData {
  ensureDirectoryExists();
  try {
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(content) as StoreData;
  } catch (error) {
    console.error("Error reading admin store, resetting to initial:", error);
    const initial = getInitialStore();
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

function writeStore(data: StoreData): void {
  ensureDirectoryExists();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function toSafeUser(user: AdminUserRecord): SafeAdminUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

// ======================== USER / SUBADMIN OPERATIONS ========================

export async function getAllAdminUsers(): Promise<SafeAdminUser[]> {
  await ensureDbInitialized();
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(adminUsers);
      if (rows && rows.length > 0) {
        const mapped: AdminUserRecord[] = rows.map((u) => {
          let perms: string[] = [];
          try {
            perms = typeof u.permissions === "string" ? JSON.parse(u.permissions) : (u.permissions || []);
          } catch {
            perms = [];
          }
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as AdminRole,
            permissions: perms,
            status: (u.status as "active" | "inactive") || "active",
            phone: u.phone || "",
            avatar: u.avatar || "",
            lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : null,
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString(),
          };
        });
        const store = readStore();
        store.users = mapped;
        writeStore(store);
        return mapped.map(toSafeUser);
      }
    } catch (err) {
      console.warn("PostgreSQL admin users query error, falling back to local file store:", err);
    }
  }

  const store = readStore();
  return store.users.map(toSafeUser);
}

export function getAllAdminUsersSync(): SafeAdminUser[] {
  const store = readStore();
  return store.users.map(toSafeUser);
}

export async function getAdminUserByEmailWithPassword(email: string): Promise<AdminUserRecord | null> {
  const lower = email.trim().toLowerCase();

  await ensureDbInitialized();
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(adminUsers);
      const matched = rows.find((u) => u.email.toLowerCase() === lower);
      if (matched) {
        let perms: string[] = [];
        try {
          perms = typeof matched.permissions === "string" ? JSON.parse(matched.permissions) : (matched.permissions || []);
        } catch {
          perms = [];
        }
        const record: AdminUserRecord = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          passwordHash: matched.passwordHash,
          role: matched.role as AdminRole,
          permissions: perms,
          status: (matched.status as "active" | "inactive") || "active",
          phone: matched.phone || "",
          avatar: matched.avatar || "",
          lastLogin: matched.lastLogin ? new Date(matched.lastLogin).toISOString() : null,
          createdAt: matched.createdAt ? new Date(matched.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: matched.updatedAt ? new Date(matched.updatedAt).toISOString() : new Date().toISOString(),
        };

        const store = readStore();
        const idx = store.users.findIndex((u) => u.id === record.id || u.email.toLowerCase() === lower);
        if (idx !== -1) {
          store.users[idx] = record;
        } else {
          store.users.unshift(record);
        }
        writeStore(store);

        return record;
      }
    } catch (err) {
      console.warn("PostgreSQL user query error, falling back to local file store:", err);
    }
  }

  const store = readStore();
  return store.users.find((u) => u.email.toLowerCase() === lower) || null;
}

export function getAdminUserById(id: string): SafeAdminUser | null {
  const store = readStore();
  const user = store.users.find((u) => u.id === id);
  return user ? toSafeUser(user) : null;
}

export async function createSubadmin(data: {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  permissions?: string[];
  phone?: string;
  creatorAdminName?: string;
}): Promise<{ success: boolean; user?: SafeAdminUser; error?: string }> {
  await ensureDbInitialized();
  const store = readStore();
  const emailClean = data.email.trim().toLowerCase();

  if (store.users.some((u) => u.email.toLowerCase() === emailClean)) {
    return { success: false, error: "An admin or subadmin with this email already exists." };
  }

  const defaultPerms =
    data.role === "super_admin"
      ? ["*"]
      : data.role === "operations"
      ? ["leads:read", "leads:write", "projects:manage", "analytics:view"]
      : data.role === "solar_consultant"
      ? ["leads:read", "leads:write", "analytics:view"]
      : ["leads:read"];

  const newUser: AdminUserRecord = {
    id: `usr-${crypto.randomUUID()}`,
    name: data.name.trim(),
    email: emailClean,
    passwordHash: hashPassword(data.password),
    role: data.role,
    permissions: data.permissions && data.permissions.length > 0 ? data.permissions : defaultPerms,
    status: "active",
    phone: data.phone?.trim() || "",
    avatar: data.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
    lastLogin: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.users.unshift(newUser);

  // Add audit log
  store.auditLogs.unshift({
    id: `log-${crypto.randomUUID()}`,
    adminId: "current",
    adminName: data.creatorAdminName || "Super Admin",
    action: "SUBADMIN_CREATED",
    details: `Created subadmin account for ${newUser.name} (${newUser.email}) with role: ${newUser.role}.`,
    createdAt: new Date().toISOString(),
  });

  writeStore(store);

  const db = getDb();
  if (db) {
    try {
      await db.insert(adminUsers).values({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
        role: newUser.role,
        permissions: JSON.stringify(newUser.permissions),
        status: newUser.status,
        phone: newUser.phone || null,
        avatar: newUser.avatar || null,
        lastLogin: null,
        createdAt: new Date(newUser.createdAt),
        updatedAt: new Date(newUser.updatedAt),
      });
    } catch (err) {
      console.error("DB insert subadmin error:", err);
    }
  }

  return { success: true, user: toSafeUser(newUser) };
}

export async function updateSubadmin(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password?: string;
    role: AdminRole;
    permissions: string[];
    status: "active" | "inactive";
    phone?: string;
  }>,
  actorName = "Admin"
): Promise<{ success: boolean; user?: SafeAdminUser; error?: string }> {
  await ensureDbInitialized();
  const store = readStore();
  const index = store.users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, error: "Subadmin not found." };
  }

  const existing = store.users[index];

  // Protect last active super_admin from deactivation or demotion
  if (existing.role === "super_admin") {
    if (data.status === "inactive" || (data.role && data.role !== "super_admin")) {
      const superAdmins = store.users.filter((u) => u.role === "super_admin" && u.status === "active");
      if (superAdmins.length <= 1) {
        return { success: false, error: "Cannot deactivate or demote the only active Super Admin." };
      }
    }
  }

  if (data.email && data.email.toLowerCase() !== existing.email.toLowerCase()) {
    const emailInUse = store.users.some(
      (u) => u.id !== id && u.email.toLowerCase() === data.email!.toLowerCase()
    );
    if (emailInUse) {
      return { success: false, error: "Email is already taken by another user." };
    }
    existing.email = data.email.trim().toLowerCase();
  }

  if (data.name) {
    existing.name = data.name.trim();
    existing.avatar = existing.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (data.phone !== undefined) existing.phone = data.phone.trim();
  if (data.role) existing.role = data.role;
  if (data.status) existing.status = data.status;
  if (data.permissions) existing.permissions = data.permissions;
  if (data.password && data.password.trim().length >= 6) {
    existing.passwordHash = hashPassword(data.password.trim());
  }

  existing.updatedAt = new Date().toISOString();
  store.users[index] = existing;

  // Add audit log
  store.auditLogs.unshift({
    id: `log-${crypto.randomUUID()}`,
    adminId: id,
    adminName: actorName,
    action: "SUBADMIN_UPDATED",
    details: `Updated account details for ${existing.name} (${existing.email}).`,
    createdAt: new Date().toISOString(),
  });

  writeStore(store);

  const db = getDb();
  if (db) {
    try {
      const existingInDb = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
      if (existingInDb && existingInDb.length > 0) {
        await db
          .update(adminUsers)
          .set({
            name: existing.name,
            email: existing.email,
            role: existing.role,
            permissions: JSON.stringify(existing.permissions || []),
            status: existing.status,
            phone: existing.phone || null,
            avatar: existing.avatar || null,
            passwordHash: existing.passwordHash,
            updatedAt: new Date(existing.updatedAt),
          })
          .where(eq(adminUsers.id, id));
      } else {
        await db.insert(adminUsers).values({
          id: existing.id,
          name: existing.name,
          email: existing.email,
          passwordHash: existing.passwordHash,
          role: existing.role,
          permissions: JSON.stringify(existing.permissions || []),
          status: existing.status,
          phone: existing.phone || null,
          avatar: existing.avatar || null,
          lastLogin: existing.lastLogin ? new Date(existing.lastLogin) : null,
          createdAt: new Date(existing.createdAt),
          updatedAt: new Date(existing.updatedAt),
        });
      }
    } catch (err) {
      console.error("DB update subadmin error:", err);
    }
  }

  return { success: true, user: toSafeUser(existing) };
}

export async function deleteSubadmin(id: string, actorName = "Admin"): Promise<{ success: boolean; error?: string }> {
  await ensureDbInitialized();
  const store = readStore();
  const target = store.users.find((u) => u.id === id);

  if (!target) {
    return { success: false, error: "User not found." };
  }

  if (target.role === "super_admin") {
    const superAdmins = store.users.filter((u) => u.role === "super_admin");
    if (superAdmins.length <= 1) {
      return { success: false, error: "Cannot delete the primary Super Admin account." };
    }
  }

  store.users = store.users.filter((u) => u.id !== id);

  store.auditLogs.unshift({
    id: `log-${crypto.randomUUID()}`,
    adminId: "current",
    adminName: actorName,
    action: "SUBADMIN_DELETED",
    details: `Deleted subadmin account for ${target.name} (${target.email}).`,
    createdAt: new Date().toISOString(),
  });

  writeStore(store);

  const db = getDb();
  if (db) {
    try {
      await db.delete(adminUsers).where(eq(adminUsers.id, id));
    } catch (err) {
      console.error("DB delete subadmin error:", err);
    }
  }

  return { success: true };
}

export async function recordUserLogin(id: string): Promise<void> {
  const store = readStore();
  const user = store.users.find((u) => u.id === id);
  if (user) {
    user.lastLogin = new Date().toISOString();
    writeStore(store);
  }

  const db = getDb();
  if (db) {
    try {
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, id));
    } catch (err) {
      console.error("DB update lastLogin error:", err);
    }
  }
}

// ======================== LEADS / CONSULTATION OPERATIONS ========================

export function getAllLeads(filter?: {
  status?: string;
  propertyType?: string;
  search?: string;
}): ConsultationLeadRecord[] {
  const store = readStore();
  let results = [...store.leads];

  if (filter?.status && filter.status !== "all") {
    results = results.filter((l) => l.status === filter.status);
  }

  if (filter?.propertyType && filter.propertyType !== "all") {
    results = results.filter((l) => l.propertyType.toLowerCase() === filter.propertyType!.toLowerCase());
  }

  if (filter?.search) {
    const s = filter.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.fullName.toLowerCase().includes(s) ||
        l.email.toLowerCase().includes(s) ||
        l.phone.includes(s) ||
        l.location.toLowerCase().includes(s)
    );
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(id: string): ConsultationLeadRecord | null {
  const store = readStore();
  return store.leads.find((l) => l.id === id) || null;
}

export function addLead(data: {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  interestedIn: string;
  averageElectricityBill: string;
  message: string;
  status?: ConsultationLeadRecord["status"];
  estimatedKw?: string;
}): ConsultationLeadRecord {
  const store = readStore();
  const newLead: ConsultationLeadRecord = {
    id: `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    location: data.location,
    propertyType: data.propertyType,
    interestedIn: data.interestedIn,
    averageElectricityBill: data.averageElectricityBill,
    message: data.message,
    status: data.status || "pending",
    estimatedKw: data.estimatedKw || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.leads.unshift(newLead);
  writeStore(store);
  return newLead;
}

export function updateLead(
  id: string,
  data: Partial<ConsultationLeadRecord>,
  actorName = "Admin"
): ConsultationLeadRecord | null {
  const store = readStore();
  const index = store.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const prev = store.leads[index];
  const updated = {
    ...prev,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  store.leads[index] = updated;

  if (data.status && data.status !== prev.status) {
    store.auditLogs.unshift({
      id: `log-${crypto.randomUUID()}`,
      adminId: "current",
      adminName: actorName,
      action: "LEAD_STATUS_UPDATED",
      details: `Lead from ${prev.fullName} updated from '${prev.status}' to '${data.status}'.`,
      createdAt: new Date().toISOString(),
    });
  }

  writeStore(store);
  return updated;
}

export function deleteLead(id: string): boolean {
  const store = readStore();
  const prevLen = store.leads.length;
  store.leads = store.leads.filter((l) => l.id !== id);
  if (store.leads.length !== prevLen) {
    writeStore(store);
    return true;
  }
  return false;
}

// ======================== PROJECTS OPERATIONS ========================

export async function getAllProjects(): Promise<SolarProjectRecord[]> {
  await ensureDbInitialized();
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(solarProjects);
      if (rows && rows.length > 0) {
        const mapped: SolarProjectRecord[] = rows.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category as "Residential" | "Commercial" | "Industrial",
          capacity: p.capacity,
          location: p.location,
          client: p.client,
          completionYear: p.completionYear,
          status: (p.status as "Completed" | "Ongoing" | "Planning") || "Completed",
          image: p.image || "/images/image 7.png",
          description: p.description || "",
          impact: p.impact || undefined,
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        }));
        // Update local file store cache
        const store = readStore();
        store.projects = mapped;
        writeStore(store);
        return mapped;
      }
    } catch (err) {
      console.warn("PostgreSQL projects query error, falling back to local file store:", err);
    }
  }

  const store = readStore();
  return store.projects;
}

export function getAllProjectsSync(): SolarProjectRecord[] {
  const store = readStore();
  return store.projects;
}

export async function addProject(data: Omit<SolarProjectRecord, "id" | "createdAt">): Promise<SolarProjectRecord> {
  const store = readStore();
  const id = `proj-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const newProject: SolarProjectRecord = {
    ...data,
    id,
    createdAt: now,
  };
  store.projects.unshift(newProject);
  writeStore(store);

  const db = getDb();
  if (db) {
    try {
      await db.insert(solarProjects).values({
        id: newProject.id,
        title: newProject.title,
        category: newProject.category,
        capacity: newProject.capacity,
        location: newProject.location,
        client: newProject.client,
        completionYear: newProject.completionYear,
        status: newProject.status,
        image: newProject.image,
        description: newProject.description,
        impact: newProject.impact || null,
        createdAt: new Date(now),
      });
    } catch (err) {
      console.error("DB insert solar project error:", err);
    }
  }

  return newProject;
}

export async function updateProject(id: string, data: Partial<SolarProjectRecord>): Promise<SolarProjectRecord | null> {
  const store = readStore();
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.projects[index] = {
    ...store.projects[index],
    ...data,
  };
  writeStore(store);
  const updated = store.projects[index];

  const db = getDb();
  if (db) {
    try {
      await db
        .update(solarProjects)
        .set({
          title: updated.title,
          category: updated.category,
          capacity: updated.capacity,
          location: updated.location,
          client: updated.client,
          completionYear: updated.completionYear,
          status: updated.status,
          image: updated.image,
          description: updated.description,
          impact: updated.impact || null,
        })
        .where(eq(solarProjects.id, id));
    } catch (err) {
      console.error("DB update solar project error:", err);
    }
  }

  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = readStore();
  const prevLen = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);
  const deleted = store.projects.length !== prevLen;
  if (deleted) {
    writeStore(store);
  }

  const db = getDb();
  if (db) {
    try {
      await db.delete(solarProjects).where(eq(solarProjects.id, id));
    } catch (err) {
      console.error("DB delete solar project error:", err);
    }
  }

  return deleted;
}


// ======================== AUDIT LOGS & STATS ========================

export function getAuditLogs(limit = 20): AuditLogRecord[] {
  const store = readStore();
  return store.auditLogs.slice(0, limit);
}

export function logAuditEvent(adminId: string, adminName: string, action: string, details: string): void {
  const store = readStore();
  store.auditLogs.unshift({
    id: `log-${crypto.randomUUID()}`,
    adminId,
    adminName,
    action,
    details,
    createdAt: new Date().toISOString(),
  });
  writeStore(store);
}

export function getDashboardStats(): DashboardStats {
  const store = readStore();
  const leads = store.leads;
  const users = store.users;

  const totalLeads = leads.length;
  const pendingLeads = leads.filter((l) => l.status === "pending").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const installedLeads = leads.filter((l) => l.status === "installed").length;

  const totalSubadmins = users.length;
  const activeSubadmins = users.filter((u) => u.status === "active").length;

  const totalProjects = store.projects.length;

  // Monthly breakdown for the last 6 months
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const monthlyLeads = months.map((month, idx) => ({
    month,
    count: Math.floor(12 + idx * 6 + (idx % 2 === 0 ? 4 : -2)),
  }));
  // Last month is the current count
  monthlyLeads[monthlyLeads.length - 1].count = totalLeads;

  // Inquiries by property type
  const propertyTypeMap: Record<string, number> = {
    Residential: 0,
    Commercial: 0,
    Industrial: 0,
    Agricultural: 0,
  };

  leads.forEach((l) => {
    const key = l.propertyType || "Residential";
    propertyTypeMap[key] = (propertyTypeMap[key] || 0) + 1;
  });

  const leadsByPropertyType = Object.entries(propertyTypeMap).map(([type, count]) => ({
    type,
    count,
  }));

  return {
    totalLeads,
    pendingLeads,
    contactedLeads,
    installedLeads,
    totalSubadmins,
    activeSubadmins,
    totalProjects,
    totalCapacityMW: "52+ MW",
    monthlyLeads,
    leadsByPropertyType,
    recentLeads: leads.slice(0, 5),
    recentActivity: store.auditLogs.slice(0, 6),
  };
}
