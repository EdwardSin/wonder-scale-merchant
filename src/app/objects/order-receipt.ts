export class OrderReceipt{
    customerId?: String;
    customer?: String | {
        firstName?: String,
        lastName?: String,
        address?: {
            address: String,
            state: String,
            postcode: String,
            country: String,
        },
        phoneNumber?: String
    };
    deliveryOption: 'self_pickup' | 'delivery';
    delivery?: {
        fee?:  number,
        etaDate?: Date
    };
    items: Array<any>;
    remark: String;
    status: String;
    promotions?: Array<String> | Array<{}>;
    _id?: String;
    receiptId?: String;
    isCustomerSaved?: boolean;
}