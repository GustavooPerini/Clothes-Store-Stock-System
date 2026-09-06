import { Component, inject, OnInit } from '@angular/core';
import { ProductResponse } from '../../../model/product-response.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { ProductService } from '../../../service/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CLOTHE_SIZES } from '../../../model/types/clothe-size.type';

@Component({
    selector: 'app-edit-product-dialog',
    imports: [MatDialogTitle,
              MatDialogModule,
              MatAnchor,
              MatFormFieldModule,
              MatInputModule,
              MatSelectModule,
              ReactiveFormsModule,
              MatButtonModule
            ],
    templateUrl: './edit-product-dialog.html',
    styleUrl: './edit-product-dialog.scss',
})
export class EditProductDialog implements OnInit{
    
    data: ProductResponse = inject(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<EditProductDialog>);
    private readonly formBuilder = inject(FormBuilder);
    private readonly productService = inject(ProductService);
    
    // Enum variables
    clotheSizes = CLOTHE_SIZES;

    // Control variables
    updateProductForm!: FormGroup

    ngOnInit(): void {
        this.updateProductForm = this.formBuilder.group({
            name: [this.data.name, Validators.required],
            size: [this.data.size, Validators.required],
            stockQuantity: [this.data.stockQuantity, Validators.required],
            unitPrice: [this.data.unitPrice, Validators.required]
        });
    }

    onSave() {
        if(this.updateProductForm.valid) {
            this.productService.updateProduct(this.data.id, this.updateProductForm.value).subscribe({
                next: (res) => {
                    console.log(res);
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    console.log(err);
                    this.dialogRef.close();
                }
            });
        }
    }
}
