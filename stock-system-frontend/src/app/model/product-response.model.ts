import { ClotheSize } from "./types/clothe-size.type";

export interface ProductResponse {
    id: number;
    name: string;
    size: ClotheSize;
    stockQuantity: number;
    unitPrice: number;
    imageUrl?: string;
}