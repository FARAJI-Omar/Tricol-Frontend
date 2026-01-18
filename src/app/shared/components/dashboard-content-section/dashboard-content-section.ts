import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-content-section',
  imports: [CommonModule],
  templateUrl: './dashboard-content-section.html',
})
export class DashboardContentSection {
  @Input() title!: string; // Required title
  @Input() description?: string; // Optional description
}
