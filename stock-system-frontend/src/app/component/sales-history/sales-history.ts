import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { SaleResponse } from '../../model/sale-response.model';
import { SaleService } from '../../service/sale.service';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales-history',
  imports: [
    MatButtonModule,
    MatTableModule,
    DatePipe,
    CurrencyPipe,
    MatPaginatorModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './sales-history.html',
  styleUrl: './sales-history.scss',
})
export class SalesHistory implements OnInit {
  private readonly router = inject(Router);
  private readonly saleService = inject(SaleService);

  sales = signal<SaleResponse[]>([]);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  displayedColumns: string[] = ['product', 'quantity', 'unitPrice', 'totalAmount', 'saleDate'];

  // Metrics computed from currently loaded sales
  pageTotalRevenue = computed(() => {
    return this.sales().reduce((sum, item) => sum + item.totalAmount, 0);
  });

  pageTotalQuantity = computed(() => {
    return this.sales().reduce((sum, item) => sum + item.quantity, 0);
  });

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.isLoading.set(true);
    this.saleService.getSales(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        this.sales.set(res.content);
        this.currentPage.set(res.pageNumber);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
        this.isLoading.set(false);
      }
    });
  }

  goToMenu() {
    this.router.navigate(['']);
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.loadSales();
  }
}
