import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../model/page-response.model';
import { ProductResponse } from '../model/product-response.model';
import { ProductRequest } from '../model/product-request.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private readonly URL_API = "http://localhost:8080/api/products"
    private readonly http = inject(HttpClient)

    getProducts(page: number = 0, size: number = 6): Observable<PageResponse<ProductResponse>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
        return this.http.get<PageResponse<ProductResponse>>(`${this.URL_API}`, { params })
    }

    getProductById(id: number): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${this.URL_API}/${id}`);
    }

    createProduct(product: ProductRequest): Observable<ProductResponse> {
        return this.http.post<ProductResponse>(this.URL_API, product);
    }

    updateProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
        return this.http.put<ProductResponse>(`${this.URL_API}/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.URL_API}/${id}`);
    }
}
