import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env';
import { User, Role, Permission, AssignRoleRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ManageUsersService {
  private baseUrl = environment.api_base_url;

  constructor(private http: HttpClient) {}

  // CRUD operations 
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/admin/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admin/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`);
  }

  // Custom endpoints
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/admin/users/roles`);
  }

  assignRole(request: AssignRoleRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/admin/users/${request.userId}/role/${request.roleId}`, 
      {}, 
      { responseType: 'text' }
    );
  }

  getUserPermissions(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/admin/users/${userId}/permissions`);
  }

  activatePermission(userId: number, permissionId: number): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/admin/users/${userId}/permissions/${permissionId}/activate`, 
      {}, 
      { responseType: 'text' }
    );
  }

  deactivatePermission(userId: number, permissionId: number): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/admin/users/${userId}/permissions/${permissionId}/deactivate`, 
      {}, 
      { responseType: 'text' }
    );
  }

  togglePermissionActivation(userId: number, permissionId: number, action: string): Observable<any> {
    if(action === 'activate') {
      return this.activatePermission(userId, permissionId);
    } else if(action === 'deactivate') {
      return this.deactivatePermission(userId, permissionId);
    }
    else {
      throw new Error('Invalid action for toggling permission activation');
    }
  }
}
