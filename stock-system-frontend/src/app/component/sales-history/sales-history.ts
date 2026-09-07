import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SaleResponse } from '../../model/sale-response.model';
import { SaleService } from '../../service/sale.service';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-sales-history',
    imports: [
        MatButtonModule,
        MatTableModule,
        DatePipe,
        CurrencyPipe,
        MatPaginatorModule
    ],
    templateUrl: './sales-history.html',
    styleUrl: './sales-history.scss',
})
export class SalesHistory implements OnInit{

    private readonly router = inject(Router);
    private readonly saleService = inject(SaleService);

    sales = signal<SaleResponse[]>([]);
    currentPage = signal<number>(0);
    pageSize = signal<number>(5);
    totalPages = signal<number>(0);
    totalElements = signal<number>(0);
    isLoading = signal<boolean>(false);

    displayedColumns: string[] = ['imageUrl', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'saleDate']

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
                console.log(this.sales())
            },
            error: (err) => {
                console.log(err);
                this.isLoading.set(false);
            }
        });
    }

    goToMenu() {
        this.router.navigate(['']);
    }

    onPageChange(newPage: number) {
        this.currentPage.set(newPage);
        this.loadSales();
    }
    
    handlePageEvent(e: PageEvent) {
        this.onPageChange(e.pageIndex);
    }
}
