import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductResponse } from '../../../model/product-response.model';
import { SaleService } from '../../../service/sale.service';
import { SaleRequest } from '../../../model/sale-request.model';

@Component({
    selector: 'app-sell-product-dialog',
    imports: [
        MatDialogTitle,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: './sell-product-dialog.html',
    styleUrl: './sell-product-dialog.scss',
})
export class SellProductDialog implements OnInit{
    
    data: ProductResponse = inject(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<SellProductDialog>);
    private readonly formBuilder = inject(FormBuilder);
    private readonly saleService = inject(SaleService);

    productForm!: FormGroup;

    ngOnInit(): void {
        this.productForm = this.formBuilder.group({
            quantity: ["", [
                Validators.required,
                Validators.min(1),
                Validators.max(this.data.stockQuantity)   
            ]]
        });
    }

    onSell() {
        if(this.productForm.valid) {
            const payload: SaleRequest = {
                productId: this.data.id,
                quantity: this.productForm.value.quantity
            }
            this.saleService.createSale(payload).subscribe({
                next: (res) => {
                    this.dialogRef.close("success");
                },
                error: (err) => {
                    this.dialogRef.close("error");
                }
            })
        }
    }
}
