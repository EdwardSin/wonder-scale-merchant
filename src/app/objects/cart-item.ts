export class CartItem{
    _id?: string;
    itemId?: string;
    name: string;
    quantity: number;
    type?: any;
    discount?: number = 0;
    price: number;
    currency: string;
    remark?: string;
    profileImage?: string;

    constructor() {

    }
    discountValue() {
        let discount = this.discount || 0;
        return this.typePrice() *  discount / 100;;
    }
    typePrice() {
        let offset = 0;
        if (this.type && this.type.amount) {
            offset = this.type.incrementType ? this.type.amount : -this.type.amount;
            return this.price + offset;
        } else if (this.type) {
            return this.type.price || this.price;
        }
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
        if (this.type) {
            return this.typePriceAfterDiscount();
        }
        return this.priceAfterDiscount();
    }
}