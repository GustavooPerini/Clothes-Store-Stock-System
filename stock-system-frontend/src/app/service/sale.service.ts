import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleResponse } from '../model/sale-response.model';
import { SaleRequest } from '../model/sale-request.model';
import { PageResponse } from '../model/page-response.model';

@Injectable({
    providedIn: 'root',
})
export class SaleService {
    private readonly URL_API = "http://localhost:8080/api/sales"
    private readonly http = inject(HttpClient)

    createSale(saleRequest: SaleRequest): Observable<SaleResponse> {
        return this.http.post<SaleResponse>(`${this.URL_API}`, saleRequest);
    }

    getSales(page: number = 0, size: number = 5): Observable<PageResponse<SaleResponse>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
        return this.http.get<PageResponse<SaleResponse>>(`${this.URL_API}`, { params });
    }
}
