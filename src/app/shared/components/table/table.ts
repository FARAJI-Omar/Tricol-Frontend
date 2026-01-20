import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'status' | 'avatar' | 'actions' | 'product-name' | 'stock';
  colorField?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  callback: (row: any) => void;
  condition?: (row: any) => boolean; // Optional condition to show/hide action
  bgColor?: string; // Background color
  textColor?: string; // Text color
  hoverBgColor?: string; 
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule],
  templateUrl: './table.html',
})
export class Table implements AfterViewInit {
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() set data(value: any[]) {
    this.dataSource.data = value;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource = new MatTableDataSource<any>([]);
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }
  
  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  getAvatarColor(name: string): string {
    if (!name) return '#E5E7EB';
    const colors = [
      '#E0E7FF', '#DBEAFE', '#FEF3C7', '#FED7AA', '#FECACA',
      '#E9D5FF', '#D1FAE5', '#FCE7F3'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
  
  getTextColor(bgColor: string): string {
    const colorMap: { [key: string]: string } = {
      '#E0E7FF': '#6366F1',
      '#DBEAFE': '#3B82F6',
      '#FEF3C7': '#F59E0B',
      '#FED7AA': '#F97316',
      '#FECACA': '#EF4444',
      '#E9D5FF': '#A855F7',
      '#D1FAE5': '#10B981',
      '#FCE7F3': '#EC4899'
    };
    return colorMap[bgColor] || '#6B7280';
  }
}
