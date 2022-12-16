export class CreateProductDto {
    id: number;
    title: string;
    description: string;
    brand: string;
    category: string;
    thumbnail: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
}
