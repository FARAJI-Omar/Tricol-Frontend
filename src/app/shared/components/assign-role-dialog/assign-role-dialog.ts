import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ManageUsersService } from '../../../core/services/manage-users-service';
import { Role, AssignRoleRequest } from '../../../core/models/user.model';

export interface AssignRoleDialogData {
  userId: number;
  userName: string;
}

@Component({
  selector: 'app-assign-role-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './assign-role-dialog.html',
})
export class AssignRoleDialog implements OnInit {
  roles: Role[] = [];
  selectedRoleId: number | null = null;
  loading = false;
  error = '';
  success = false;

  constructor(
    private dialogRef: MatDialogRef<AssignRoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AssignRoleDialogData,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.manageUsersService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load roles';
        this.loading = false;
      }
    });
  }

  assignRole(): void {
    if (!this.selectedRoleId) {
      this.error = 'Please select a role';
      return;
    }

    this.loading = true;
    this.error = '';

    const request: AssignRoleRequest = {
      userId: this.data.userId,
      roleId: this.selectedRoleId
    };

    this.manageUsersService.assignRole(request).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (err) => {
        console.error('Assign role error:', err);
        this.error = 'Failed to assign role';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
