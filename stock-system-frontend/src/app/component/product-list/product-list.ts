import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product-response.model';

@Component({
    selector: 'app-product-list',
    imports: [],
    templateUrl: './product-list.html',
    styleUrl: './product-list.scss',
})
export class ProductList implements OnInit{
    
    private readonly productService = inject(ProductService);

    products = signal<ProductResponse[]>([]);
    currentPage = signal<number>(0);
    pageSize = signal<number>(5);
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
                console.log(res);
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
}
