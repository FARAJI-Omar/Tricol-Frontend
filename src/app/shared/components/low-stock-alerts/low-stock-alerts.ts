import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../admin/products/services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-low-stock-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './low-stock-alerts.html',
})
export class LowStockAlerts implements OnInit {
  lowStockProducts = signal<Product[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadLowStockProducts();
  }

  private loadLowStockProducts() {
    this.productService.getLowStockProducts().subscribe(products => {
      this.lowStockProducts.set(products);
    });
  }
}
