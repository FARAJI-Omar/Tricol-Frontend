import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { getAdminSidebarMenu } from '../../shared/components/sidebar/admin-sidebar-menu';

@Component({
  selector: 'app-admin-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  sidebarMenu = getAdminSidebarMenu();
}
