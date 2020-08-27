export class CartItem{
    _id?: string;
    name: string;
    quantity: number;
    type?: any;
    discount?: number = 0;
    price: number;
    currency: string;
    remark?: string;

    constructor() {

    }
    discountValue() {
        let discount = this.discount || 0;
        return (this.price + this.typePrice()) *  discount / 100;;
    }
    typePrice() {
        let offset = 0;
        if (this.type) {
            offset = this.type.incrementType ? this.type.amount : -this.type.amount;
        }
        return offset;
    }
    priceAfterDiscount() {
        let discount = this.discount || 0;
        return this.price * (100 - discount) / 100;;
    }
    typePriceAfterDiscount() {
        let discount = this.discount || 0;
        return this.typePrice() * (100 - discount) / 100;
    }
    amount() {
        return this.priceAfterDiscount() + this.typePriceAfterDiscount();
    }
}