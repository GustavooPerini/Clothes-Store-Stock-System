import { Routes } from '@angular/router';
import { ProductList } from './component/product-list/product-list';
import { Menu } from './component/menu/menu';
import { NewProduct } from './component/new-product/new-product';

export const routes: Routes = [
    {
        path: '',
        component: Menu,
        pathMatch: 'full'
    },
    {
        path: 'products',
        component: ProductList
    },
    {
        path: 'new-product',
        component: NewProduct
    }
];
