export interface Permission {
  id: number;
  name: string;
  active: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  permissions: Permission[];
}

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
}
