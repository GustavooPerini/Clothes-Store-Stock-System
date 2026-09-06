import { Component, inject } from '@angular/core';
import { ProductResponse } from '../../../model/product-response.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../service/product.service';

@Component({
    selector: 'app-delete-product-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './delete-product-dialog.html',
    styleUrl: './delete-product-dialog.scss',
})
export class DeleteProductDialog {

    data: ProductResponse = inject(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<DeleteProductDialog>);
    private readonly productService = inject(ProductService);

    deleteProduct() {
        this.productService.deleteProduct(this.data.id).subscribe({
            next: (res) => {
                this.dialogRef.close("success");
            },
            error: (err) => {
                this.dialogRef.close("error");
            }
        });
    }
}
