import { Routes } from '@angular/router';
import { ProductList } from './component/product-list/product-list';
import { Menu } from './component/menu/menu';
import { NewProduct } from './component/new-product/new-product';
import { SalesHistory } from './component/sales-history/sales-history';

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
    },
    {
        path: 'sales',
        component: SalesHistory
    }
];
