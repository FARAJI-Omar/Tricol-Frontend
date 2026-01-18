import { Component, OnInit } from '@angular/core';
import { DashboardContentSection } from "../../../shared/components/dashboard-content-section/dashboard-content-section";
import { Table, TableColumn, TableAction } from "../../../shared/components/table/table";
import { ManageUsersService } from '../../../core/services/manage-users-service';
import { User } from '../../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AssignRoleDialog } from '../../../shared/components/assign-role-dialog/assign-role-dialog';
import { PermissionsManage } from "../../../shared/components/permissions-manage/permissions-manage";

@Component({
  selector: 'app-users',
  imports: [DashboardContentSection, Table],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  constructor(
    private manageUsersService: ManageUsersService,
    private dialog: MatDialog
  ) {}

  roleColors = {
    'ADMIN': {
      bgColor: '#f7adad',
      textColor: '#d10000'
    },
    'RESPONSABLE_ACHATS': {
      bgColor: '#DBEAFE',
      textColor: '#3B82F6'
    },
    'MAGASINIER': {
      bgColor: '#faeea2',
      textColor: '#c2a910'
    },
    'CHEF_ATELIER': {
      bgColor: '#D1FAE5',
      textColor: '#10B981'
    }
  };

  columns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge', colorField: 'roleColor' },
    { key: 'status', label: 'Account Status', type: 'status' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  get actions(): TableAction[] {
    return [
      {
        label: 'Assign Role',
        callback: (row: any) => this.assignRole(row),
        condition: (row: any) => row.status === 'Inactive',
        bgColor: '#3B82F6',
        textColor: '#FFFFFF',
        hoverBgColor: '#2563EB'
      },
      {
        label: 'Permissions',
        callback: (row: any) => this.managePermissions(row),
        condition: (row: any) => row.status === 'Active',
        bgColor: '#f2efa7',
        textColor: '#374151',
        hoverBgColor: '#facc15'
      }
    ];
  }

  data: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.manageUsersService.getUsers().subscribe({
      next: (users) => {
        this.data = users.map(user => {
          const roleName = user.role?.name || '';
          const roleInfo = roleName ? this.roleColors[roleName as keyof typeof this.roleColors] : null;
          return {
            id: user.id.toString(),
            name: user.fullName || user.username,
            email: user.email,
            role: roleName,
            roleColor: roleInfo?.bgColor || '#F3F4F6',
            roleTextColor: roleInfo?.textColor || '#9CA3AF',
            status: roleName ? 'Active' : 'Inactive'
          };
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  assignRole(user: any): void {
    const dialogRef = this.dialog.open(AssignRoleDialog, {
      data: {
        userId: Number(user.id),
        userName: user.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  managePermissions(user: any): void {
    const dialogRef = this.dialog.open(PermissionsManage, {
      data: {
        userId: Number(user.id),
        userName: user.name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }
}
