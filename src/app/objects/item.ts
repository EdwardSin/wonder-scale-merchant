export class Item {
    _id: string;
    refId: string;
    name: string;
    description: string;
    profileImage: string;
    profileImages: Array<string>;
    profileImageIndex: number;
    descriptionImages: Array<string>;
    types: Array<any>;
    shop?: any;
    price: number;
    currency: string;
    discount: number;
    quantity: number;
    weight: number;
    isEntityNew: boolean;
    isInStock: boolean;
    isOffer: boolean;
    priceAfterDiscount?: number;
    categories: string[];
    isDiscountExisting: boolean;
}