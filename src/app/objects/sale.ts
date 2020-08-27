import { CartItem } from "./cart-item";

export class Sale{
    _id: Number;
    date: Date;
    shop: any;
    commission: Number;
    discount: Array<any>;
    tax: Array<any>;
    orders: Array<CartItem>;
    table: any;
    totalPersons: Number;
    status: String
}