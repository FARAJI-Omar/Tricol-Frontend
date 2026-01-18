import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SidebarItem } from './sidebar-item';
import { UserDataService } from '../../../core/services/user-data-service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input() menu: SidebarItem[] = [];
  isCollapsed = false;

  constructor(private userDataService: UserDataService) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  handleItemClick(item: SidebarItem) {
    if (item.action) {
      item.action();
    }
  }
}
