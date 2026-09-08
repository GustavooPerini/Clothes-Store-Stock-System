import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { CLOTHE_SIZES } from '../../model/types/clothe-size.type';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackbar } from '../snackbars/generic-snackbar/generic-snackbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-new-product',
    imports: [ 
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterLink
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
    imagePreview: string | null = null;
    isSubmitting = false;
    
    productForm!: FormGroup

    ngOnInit(): void {
        this.createProductForm();
    }
    
    createProductForm() {
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            size: ['', Validators.required],
            stockQuantity: ['', [Validators.required, Validators.min(0)]],
            unitPrice: ['', [Validators.required, Validators.min(0.01)]]
        });
    }

    goToMenu() {
        this.router.navigate(['']);
    }

    onFileSelected(e: Event) {
        const input = e.target as HTMLInputElement;
        if(input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    removeImage() {
        this.selectedFile = null;
        this.imagePreview = null;
    }

    onSubmit(formDirective: FormGroupDirective) {
        if(this.productForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.productService.createProduct(this.productForm.value).subscribe({
                next: (res) => {
                    if(this.selectedFile != null) {
                        this.productService.uploadProductImage(res.id, this.selectedFile).subscribe({
                            next: () => {
                                this.openSnackbar(GenericSnackbar, "Produto e imagem adicionados com sucesso!");
                                formDirective.resetForm();
                                this.removeImage();
                                this.isSubmitting = false;
                                this.router.navigate(['/products']);
                            },
                            error: () => {
                                this.openSnackbar(GenericSnackbar, "Produto adicionado, mas erro no upload da imagem!");
                                formDirective.resetForm();
                                this.removeImage();
                                this.isSubmitting = false;
                                this.router.navigate(['/products']);
                            }
                        })
                    }
                    else {
                        this.openSnackbar(GenericSnackbar, "Produto adicionado com sucesso!");
                        formDirective.resetForm();
                        this.removeImage();
                        this.isSubmitting = false;
                        this.router.navigate(['/products']);
                    }
                },
                error: (err) => {
                    console.error(err);
                    this.openSnackbar(GenericSnackbar, "Erro ao adicionar o produto!");
                    this.isSubmitting = false;
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
