import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product-response.model';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
    selector: 'app-product-list',
    imports: [ CurrencyPipe, MatCardModule, MatButtonModule, MatGridListModule, MatPaginatorModule ],
    templateUrl: './product-list.html',
    styleUrl: './product-list.scss',
})
export class ProductList implements OnInit{
    
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);

    products = signal<ProductResponse[]>([]);
    currentPage = signal<number>(0);
    pageSize = signal<number>(6);
    totalPages = signal<number>(0);
    totalElements = signal<number>(0);
    isLoading = signal<boolean>(false); 

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.isLoading.set(true);
        this.productService.getProducts(this.currentPage(), this.pageSize()).subscribe({
            next: (res) => {
                this.products.set(res.content);
                this.totalPages.set(res.totalPages);
                this.totalElements.set(res.totalElements);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.log(err);
                this.isLoading.set(false);
            }
        });
    }

    onPageChange(newPage: number) {
        this.currentPage.set(newPage);
        this.loadProducts();
    }

    deleteProduct(id: number) {
        this.isLoading.set(true);
        this.productService.deleteProduct(id).subscribe({
            next: (res) => {
                this.loadProducts();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.log(err);
                this.isLoading.set(false);
            }
        });
    }

    handlePageEvent(e: PageEvent) {
        this.onPageChange(e.pageIndex);
    }

    goToMenu() {
        this.router.navigate(['']);
    }
}
