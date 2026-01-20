import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockMovementService } from '../../../core/services/stock-movement.service';
import { StockMovement } from '../../../core/models/stock-movement.model';
import { DashboardContentSection } from '../dashboard-content-section/dashboard-content-section';
import { Table, TableColumn } from '../table/table';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [CommonModule, DashboardContentSection, Table],
  templateUrl: './stock-movements.html',
})
export class StockMovements implements OnInit {
  private stockMovementService = inject(StockMovementService);

  movements = signal<StockMovement[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  getTypeColors(type: string): { bgColor: string; textColor: string } {
    const colors: Record<string, { bgColor: string; textColor: string }> = {
      in: { bgColor: '#D1FAE5', textColor: '#065F46' },
      out: { bgColor: '#FEE2E2', textColor: '#991B1B' }
    };
    return colors[type] || { bgColor: '#F3F4F6', textColor: '#374151' };
  }

  displayMovements = computed(() => {
    return this.movements().map(movement => {
      const typeColors = this.getTypeColors(movement.type);
      return {
        ...movement,
        date: new Date(movement.date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        typeBadge: movement.type.toUpperCase(),
        typeColor: typeColors.bgColor,
        typeTextColor: typeColors.textColor,
        quantityDisplay: movement.quantity,
        orderDisplay: movement.orderId ? `#${movement.orderId}` : '-'
      };
    });
  });

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'typeBadge', label: 'Type', type: 'badge', colorField: 'typeColor' },
    { key: 'productName', label: 'Product', type: 'text' },
    { key: 'quantityDisplay', label: 'Quantity', type: 'text' },
    { key: 'lotNumber', label: 'Lot Number', type: 'text' },
    { key: 'orderDisplay', label: 'Order', type: 'text' },
    { key: 'date', label: 'Date', type: 'text' }
  ];

  ngOnInit(): void {
    this.loadMovements();
  }

  loadMovements(): void {
    this.isLoading.set(true);
    this.stockMovementService.getStockMovements(this.currentPage(), 10).subscribe({
      next: (response) => {
        this.movements.set(response.content);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading stock movements:', error);
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadMovements();
  }
}
