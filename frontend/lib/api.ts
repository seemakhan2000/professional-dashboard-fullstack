import {
  AdminLoginResponse,
  ApiResponse,
  DashboardRecord,
  DashboardRecordInput
} from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store",
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      message: data?.message || "Something went wrong. Please try again."
    };
  }

  return data as ApiResponse<T>;
}

export function getRecords() {
  return request<DashboardRecord[]>("/dashboard");
}

export function getRecord(id: string) {
  return request<DashboardRecord>(`/dashboard/${id}`);
}

export function createRecord(data: DashboardRecordInput) {
  return request<DashboardRecord>("/dashboard", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateRecord(id: string, data: DashboardRecordInput) {
  return request<DashboardRecord>(`/dashboard/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteRecord(id: string) {
  return request<null>(`/dashboard/${id}`, {
    method: "DELETE"
  });
}

export async function adminLogin(
  name: string,
  password: string
): Promise<AdminLoginResponse> {
  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Invalid credentials"
      };
    }

    return data as AdminLoginResponse;
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again."
    };
  }
}
