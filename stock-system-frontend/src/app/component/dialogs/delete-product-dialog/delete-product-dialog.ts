import { Component, inject } from '@angular/core';
import { ProductResponse } from '../../../model/product-response.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-delete-product-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './delete-product-dialog.html',
  styleUrl: './delete-product-dialog.scss',
})
export class DeleteProductDialog {
  data: ProductResponse = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteProductDialog>);
  private readonly productService = inject(ProductService);

  isDeleting = false;

  get productImageUrl(): string {
    if (this.data.imageUrl) {
      return 'http://localhost:8080' + this.data.imageUrl;
    }
    return 'https://placehold.co/80x80?text=Sem+Foto';
  }

  deleteProduct() {
    if (!this.isDeleting) {
      this.isDeleting = true;
      this.productService.deleteProduct(this.data.id).subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: () => {
          this.isDeleting = false;
          this.dialogRef.close('error');
        }
      });
    }
  }
}
