import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu',
    imports: [ MatButtonModule, RouterLink ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu {}
