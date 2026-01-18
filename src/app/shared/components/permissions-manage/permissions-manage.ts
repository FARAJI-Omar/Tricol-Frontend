import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ManageUsersService } from '../../../core/services/manage-users-service';
import { Permission } from '../../../core/models/user.model';
import { UserDataService } from '../../../core/services/user-data-service';

export interface PermissionsManageDialogData {
  userId: number;
  userName: string;
}

@Component({
  selector: 'app-permissions-manage',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './permissions-manage.html',
})
export class PermissionsManage implements OnInit {
  permissions: Permission[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private dialogRef: MatDialogRef<PermissionsManage>,
    @Inject(MAT_DIALOG_DATA) public data: PermissionsManageDialogData,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;
    this.manageUsersService.getUserPermissions(this.data.userId).subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load permissions';
        this.loading = false;
      }
    });
  }

  togglePermission(permission: Permission): void {
    this.loading = true;
    this.error = '';
    const action = permission.active ? 'deactivate' : 'activate';
    this.manageUsersService.togglePermissionActivation(this.data.userId, permission.id, action).subscribe({   
      next: (message) => {
        permission.active = !permission.active;
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.success = false;
        }, 1500);
      },
      error: (err) => {
        this.error = `Failed to ${action} permission`;
        this.loading = false;
      }
    }); 
  }
  

  close(): void {
    this.dialogRef.close();
  }
}
