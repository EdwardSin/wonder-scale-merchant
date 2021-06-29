import * as _ from 'lodash';
import { CartItem } from './cart-item';
export class Tax {
    name: string;
    rate: number = 0;
    isPercentage: boolean;
}
export class Discount {
    name: string;
    rate: number = 0;
    isPercentage: boolean;
}

export class Cashier{
    private _cartItems: Array<CartItem> = [];
    private _discount: Array<Discount> = [];
    private _tax: Array<Tax> = [];
    private _commission: number;

    set tax(value: Array<Tax>) {
        this._tax = value;
    }
    set discount(value: Array<Discount>) {
        this._discount = value;
    }
    set commission(value: number) {
        this._commission = value;
    }
    set cartItems(value: Array<CartItem>) {
        this._cartItems = value;
    }
    get cartItems(): Array<CartItem> {
        return this._cartItems;
    }
    get discount(): Array<Discount> {
        return this._discount;
    }
    get tax(): Array<Tax> {
        return this._tax;
    }
    get commission(): number {
        return this._commission;
    }
    getSubtotal(): number {
        return _.sumBy(this._cartItems, function (item) {
            let subtotal = 0;
            item = Object.assign(new CartItem, item);
            if (item?.subItems?.length) {
                subtotal = _.sumBy(item.subItems, function (subItem) {
                    return subItem.quantity * subItem.price;
                });
            }
            if (item.amount || item.price) {
                return item.amount() * item.quantity + subtotal;
            }
            return 0;
        });
    }
    getItemDiscount(): number {
        let discountTotal = _.sumBy(this.cartItems, function (cartItem) {
            return cartItem.discountValue();
        });
        return discountTotal;
    }
    getDiscount(): number {
        let subtotal = this.getSubtotal();
        let discountTotal = _.sumBy(this._discount, function (discountItem) {
            let total = discountItem.isPercentage ? (subtotal * discountItem.rate / 100) : discountItem.rate ;
            return total;
        });
        return discountTotal;
    }
    getDiscountByName(name=''): number {
        let subtotal = this.getSubtotal();
        let discountTotal = _.sumBy(this._discount, function (discountItem) {
            let total = 0;
            if (discountItem.name == name) {
                total = discountItem.isPercentage ? (subtotal * discountItem.rate / 100) : discountItem.rate ;
            }
            return total;
        });
        return discountTotal;
    }
    getTax(): number {
        let subtotal = this.getSubtotal();
        let taxTotal = _.sumBy(this._tax, function (taxItem) {
            let total = taxItem.isPercentage ? (subtotal * taxItem.rate / 100) : taxItem.rate ;
            return total;
        });
        return taxTotal;
    }
    getTaxByName(name=''): number {
        let subtotal = this.getSubtotal();
        let taxTotal = _.sumBy(this._tax, function (taxItem) {
            let total = 0;
            if (taxItem.name == name) {
                total = taxItem.isPercentage ? (subtotal * taxItem.rate / 100) : taxItem.rate ;
            }
            return total;
        });
        return taxTotal;
    }
    getCommission(): number {
        let total = this.getTotal();
        return total * this.commission / 100;
    }
    getTotal(): number {
        // return this.getSubtotal() - this.getDiscount() + this.getTax();
        return this.getSubtotal();
    }
}