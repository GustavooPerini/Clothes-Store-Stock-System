import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductResponse } from '../../model/product-response.model';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProductDialog } from '../dialogs/edit-product-dialog/edit-product-dialog';
import { DeleteProductDialog } from '../dialogs/delete-product-dialog/delete-product-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbar } from '../snackbars/generic-snackbar/generic-snackbar';
import { SellProductDialog } from '../dialogs/sell-product-dialog/sell-product-dialog';
import { CLOTHE_SIZES } from '../../model/types/clothe-size.type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-product-list',
    imports: [ CurrencyPipe, 
               MatCardModule,
               MatButtonModule,
               MatPaginatorModule,
               MatDialogModule,
               MatFormFieldModule,
               MatSelectModule,
               MatInputModule,
               MatIconModule,
               RouterLink
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

    clotheSizes = CLOTHE_SIZES;
    searchTerm = signal<string>('');
    selectedSize = signal<string>('');

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.isLoading.set(true);
        this.productService.getProducts(
                this.currentPage(),
                this.pageSize(),
                this.searchTerm(),
                this.selectedSize()
            ).subscribe({
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
            else if(result === "success-img") {
                this.loadProducts();
                this.openSnackbar(GenericSnackbar, "Produto e imagem editados com sucesso!");
            }
            else if(result === "error-img") {
                this.loadProducts();
                this.openSnackbar(GenericSnackbar, "Produto editado, mas erro no upload da imagem!");
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

    openSaleDialog(product: ProductResponse) {
        const dialogRef = this.dialog.open(SellProductDialog, {
            data: product,
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === "success") {
                this.loadProducts();
                this.openSnackbar(GenericSnackbar, "Venda efetuada com sucesso!")
            }
            else if(result === "error") {
                this.openSnackbar(GenericSnackbar, "Erro ao vender o produto!")
            }
        });
    }

    openSnackbar(component: any, message: string) {
        this.snackbar.openFromComponent(component, {
            data: message,
            duration: 4000
        })
    }

    // Filter methods
    onSearch(term: string) {
        this.searchTerm.set(term);
        this.currentPage.set(0);
        this.loadProducts();
    }

    onSizeChange(size: string) {
        this.selectedSize.set(size);
        this.currentPage.set(0);
        this.loadProducts();
    }

    clearFilters() {
        this.searchTerm.set('');
        this.selectedSize.set('');
        this.currentPage.set(0);
        this.loadProducts();
    }
}
