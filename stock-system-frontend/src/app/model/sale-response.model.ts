export interface SaleResponse {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    saleDate: string;
    imageUrl?: string;
}