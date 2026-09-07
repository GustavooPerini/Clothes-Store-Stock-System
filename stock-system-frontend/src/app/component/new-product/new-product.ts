import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CLOTHE_SIZES } from '../../model/types/clothe-size.type';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbar } from '../snackbars/generic-snackbar/generic-snackbar';

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
    private readonly snackbar = inject(MatSnackBar);

    // Enum variables
    clotheSizes = CLOTHE_SIZES;

    // Control variables
    selectedFile: File | null = null;
    
    productForm!: FormGroup

    ngOnInit(): void {
        this.createProductForm();
    }
    
    createProductForm() {
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
        const input = e.target as HTMLInputElement;
        if(input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    onSubmit(formDirective: FormGroupDirective) {
        if(this.productForm.valid) {
            this.productService.createProduct(this.productForm.value).subscribe({
                next: (res) => {
                    console.log(res);
                    if(this.selectedFile != null) {
                        this.productService.uploadProductImage(res.id, this.selectedFile).subscribe({
                            next: (res) => {
                                this.openSnackbar(GenericSnackbar, "Produto e imagem adicionado com sucesso!");
                                formDirective.resetForm();
                                this.selectedFile = null;
                            },
                            error: (err) => {
                                this.openSnackbar(GenericSnackbar, "Produto adicionado, mas erro no upload da imagem!");
                                formDirective.resetForm();
                                this.selectedFile = null;
                            }
                        })
                    }
                    else {
                        this.openSnackbar(GenericSnackbar, "Produto adicionado com sucesso!");
                        formDirective.resetForm();
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.openSnackbar(GenericSnackbar, "Erro ao adicionar o produto!");
                }
            });
        }
    }

    openSnackbar(component: any, message: string) {
        this.snackbar.openFromComponent(component, {
            data: message,
            duration: 4000
        })
    }
}
