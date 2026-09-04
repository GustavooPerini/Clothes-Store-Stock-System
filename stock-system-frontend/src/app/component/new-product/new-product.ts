import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CLOTHE_SIZES } from '../../model/types/clothe-size.type';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';

@Component({
    selector: 'app-new-product',
    imports: [ 
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
    ],
    templateUrl: './new-product.html',
    styleUrl: './new-product.scss',
})
export class NewProduct implements OnInit{
    
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);
    private readonly productService = inject(ProductService);

    // Enum variables
    clotheSizes = CLOTHE_SIZES;

    // Control variables
    selectedFile: File | null = null;
    
    productForm!: FormGroup

    ngOnInit(): void {
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            size: ['', Validators.required],
            stockQuantity: ['', Validators.required],
            unitPrice: ['', Validators.required]
        });
    }

    goToMenu() {
        this.router.navigate(['']);
    }

    onFileSelected(e: Event) {
        console.log(e)
    }

    onSubmit() {
        if(this.productForm.valid) {
            this.productService.createProduct(this.productForm.value).subscribe({
                next: (res) => {
                    console.log(res);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
    }
}
