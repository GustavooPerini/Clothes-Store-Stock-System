import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'app-generic-snackbar',
    imports: [
        MatSnackBarModule,
        MatButtonModule
    ],
    templateUrl: './generic-snackbar.html',
    styleUrl: './generic-snackbar.scss',
})
export class GenericSnackbar {

    message: string = inject(MAT_SNACK_BAR_DATA);
    private readonly snackbarRef = inject(MatSnackBarRef<GenericSnackbar>);

    closeSnackbar() {
        this.snackbarRef.dismissWithAction();
    }
}
