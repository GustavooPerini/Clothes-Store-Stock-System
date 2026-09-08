import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-generic-snackbar',
  imports: [
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './generic-snackbar.html',
  styleUrl: './generic-snackbar.scss',
})
export class GenericSnackbar {
  message: string = inject(MAT_SNACK_BAR_DATA);
  private readonly snackbarRef = inject(MatSnackBarRef<GenericSnackbar>);

  get isError(): boolean {
    return this.message ? this.message.toLowerCase().includes('erro') : false;
  }

  closeSnackbar() {
    this.snackbarRef.dismissWithAction();
  }
}
