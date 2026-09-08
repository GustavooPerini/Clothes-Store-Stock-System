import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { ProductResponse } from '../../../model/product-response.model';
import { SaleService } from '../../../service/sale.service';
import { SaleRequest } from '../../../model/sale-request.model';

@Component({
  selector: 'app-sell-product-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './sell-product-dialog.html',
  styleUrl: './sell-product-dialog.scss',
})
export class SellProductDialog implements OnInit {
  data: ProductResponse = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SellProductDialog>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly saleService = inject(SaleService);

  productForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      quantity: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.data.stockQuantity)
      ]]
    });
  }

  get calculatedTotal(): number {
    const qty = this.productForm?.get('quantity')?.value || 0;
    return qty * this.data.unitPrice;
  }

  get productImageUrl(): string {
    if (this.data.imageUrl) {
      return 'http://localhost:8080' + this.data.imageUrl;
    }
    return 'https://placehold.co/100x100?text=Sem+Foto';
  }

  incrementQuantity() {
    const current = this.productForm.get('quantity')?.value || 1;
    if (current < this.data.stockQuantity) {
      this.productForm.patchValue({ quantity: current + 1 });
    }
  }

  decrementQuantity() {
    const current = this.productForm.get('quantity')?.value || 1;
    if (current > 1) {
      this.productForm.patchValue({ quantity: current - 1 });
    }
  }

  onSell() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const payload: SaleRequest = {
        productId: this.data.id,
        quantity: this.productForm.value.quantity
      };
      this.saleService.createSale(payload).subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: () => {
          this.isSubmitting = false;
          this.dialogRef.close('error');
        }
      });
    }
  }
}
