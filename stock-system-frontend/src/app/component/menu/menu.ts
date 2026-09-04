import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    imports: [ MatButtonModule ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu {

    private readonly router = inject(Router)

    goToProducts() {
        this.router.navigate(['/products']);
    }

    goToNewProductForm() {
        this.router.navigate(['/new-product']);
    }
}
