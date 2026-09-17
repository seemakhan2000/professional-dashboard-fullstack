export type RecordStatus = "Active" | "Pending" | "Inactive";

export interface DashboardRecord {
  _id: string;
  name: string;
  category: string;
  value: number;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardRecordInput {
  name: string;
  category: string;
  value: number;
  status: RecordStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  role?: "admin";
  message?: string;
}
