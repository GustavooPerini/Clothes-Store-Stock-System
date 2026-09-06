import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product-response.model';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProductDialog } from '../dialogs/edit-product-dialog/edit-product-dialog';
import { DeleteProductDialog } from '../dialogs/delete-product-dialog/delete-product-dialog';
import { MatSnackBar, SimpleSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbar } from '../snackbars/generic-snackbar/generic-snackbar';

@Component({
    selector: 'app-product-list',
    imports: [ CurrencyPipe, 
               MatCardModule,
               MatButtonModule,
               MatGridListModule,
               MatPaginatorModule,
               MatDialogModule
            ],
    templateUrl: './product-list.html',
    styleUrl: './product-list.scss',
})
export class ProductList implements OnInit{
    
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly snackbar = inject(MatSnackBar);

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

    handlePageEvent(e: PageEvent) {
        this.onPageChange(e.pageIndex);
    }

    goToMenu() {
        this.router.navigate(['']);
    }

    openEditDialog(product: ProductResponse) {
        const dialogRef = this.dialog.open(EditProductDialog, {
            data: product,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((result) => {
            // Se for true, quer dizer que eu fechei com dialogRef.close(true)
            if(result === "success") {
                this.loadProducts();
                this.openSnackbar(GenericSnackbar, "Produto editado com sucesso!");
            }
            else if (result === "error") {
                this.openSnackbar(GenericSnackbar, "Erro ao editar produto!")
            }
        });
    }

    openDeleteDialog(product: ProductResponse) {
        const dialogRef = this.dialog.open(DeleteProductDialog, {
            data: product,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === "success") {
                this.loadProducts();
                this.openSnackbar(GenericSnackbar, "Produto deletado com sucesso!");
            }
            else if (result === "error") {
                this.openSnackbar(GenericSnackbar, "Erro ao deletar produto!")
            }
        });
    }

    openSnackbar(component: any, message: string) {
        this.snackbar.openFromComponent(component, {
            data: message,
            duration: 4000
        })
    }
}
