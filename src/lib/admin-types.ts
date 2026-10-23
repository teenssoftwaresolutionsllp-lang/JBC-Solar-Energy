export type AdminRole =
  | "super_admin"
  | "operations"
  | "solar_consultant"
  | "support";

export type AdminPermission =
  | "*"
  | "subadmins:manage"
  | "leads:read"
  | "leads:write"
  | "projects:manage"
  | "analytics:view"
  | "settings:manage";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: string[];
  status: "active" | "inactive";
  phone?: string;
  avatar?: string;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SafeAdminUser = Omit<AdminUserRecord, "passwordHash">;

export type LeadStatus =
  | "pending"
  | "contacted"
  | "quoted"
  | "scheduled"
  | "installed"
  | "rejected";

export interface ConsultationLeadRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  interestedIn: string;
  averageElectricityBill: string;
  message: string;
  status: LeadStatus;
  assignedTo?: string | null;
  assignedAdminName?: string | null;
  adminNotes?: string | null;
  estimatedKw?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SolarProjectRecord {
  id: string;
  title: string;
  category: "Residential" | "Commercial" | "Industrial";
  capacity: string;
  location: string;
  client: string;
  completionYear: string;
  status: "Completed" | "Ongoing" | "Planning";
  image: string;
  description: string;
  impact?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  pendingLeads: number;
  contactedLeads: number;
  installedLeads: number;
  totalSubadmins: number;
  activeSubadmins: number;
  totalProjects: number;
  totalCapacityMW: string;
  monthlyLeads: { month: string; count: number }[];
  leadsByPropertyType: { type: string; count: number }[];
  recentLeads: ConsultationLeadRecord[];
  recentActivity: AuditLogRecord[];
}
