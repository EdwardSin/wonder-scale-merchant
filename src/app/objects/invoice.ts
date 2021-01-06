export class Invoice{
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
        etaDate?: String,
        etaHour?: number,
        etaMin?: number,
        date?: Date
    };
    items: Array<any>;
    remark: String;
    status: String;
    promotions?: Array<String> | Array<{}>;
    _id?: String;
    receiptId?: String;
    isCustomerSaved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}