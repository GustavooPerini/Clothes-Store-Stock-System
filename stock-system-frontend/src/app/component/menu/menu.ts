import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu',
    imports: [ MatButtonModule, MatIconModule, RouterLink ],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu {}
