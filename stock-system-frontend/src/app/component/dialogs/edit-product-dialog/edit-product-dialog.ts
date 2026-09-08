import { Component, inject, OnInit } from '@angular/core';
import { ProductResponse } from '../../../model/product-response.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../service/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CLOTHE_SIZES } from '../../../model/types/clothe-size.type';

@Component({
  selector: 'app-edit-product-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-product-dialog.html',
  styleUrl: './edit-product-dialog.scss',
})
export class EditProductDialog implements OnInit {
  data: ProductResponse = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditProductDialog>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  // Enum variables
  clotheSizes = CLOTHE_SIZES;

  // Control variables
  updateProductForm!: FormGroup;
  selectedFile: File | null = null;
  newImagePreview: string | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.updateProductForm = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      size: [this.data.size, Validators.required],
      stockQuantity: [this.data.stockQuantity, [Validators.required, Validators.min(0)]],
      unitPrice: [this.data.unitPrice, [Validators.required, Validators.min(0.01)]]
    });
  }

  get currentImageUrl(): string {
    if (this.newImagePreview) {
      return this.newImagePreview;
    }
    if (this.data.imageUrl) {
      return 'http://localhost:8080' + this.data.imageUrl;
    }
    return 'https://placehold.co/120x120?text=Sem+Foto';
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSave() {
    if (this.updateProductForm.valid && !this.isSaving) {
      this.isSaving = true;
      this.productService.updateProduct(this.data.id, this.updateProductForm.value).subscribe({
        next: () => {
          if (this.selectedFile) {
            this.productService.uploadProductImage(this.data.id, this.selectedFile).subscribe({
              next: () => {
                this.dialogRef.close('success-img');
              },
              error: () => {
                this.dialogRef.close('error-img');
              }
            });
          } else {
            this.dialogRef.close('success');
          }
        },
        error: () => {
          this.isSaving = false;
          this.dialogRef.close('error');
        }
      });
    }
  }
}
