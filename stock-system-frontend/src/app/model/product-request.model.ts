import { ClotheSize } from "./types/clothe-size.type";

export interface ProductRequest {
    name: string,
    size: ClotheSize,
    stockQuantity: number,
    unitPrice: number
}