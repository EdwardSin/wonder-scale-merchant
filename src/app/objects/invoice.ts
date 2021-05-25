export class Invoice{
    customerId?: string;
    customer?: string | {
        recipientName?: string,
        address?: {
            address: string,
            state: string,
            postcode: string,
            country: string,
        },
        phoneNumber?: string
    };
    deliveryOption: 'self_pickup' | 'delivery';
    delivery?: {
        _id?: string,
        fee?:  number,
        etaDate?: string | Date,
        etaHour?: number,
        etaMin?: number,
        date?: Date
    };
    items: Array<any>;
    remark: string;
    status: string;
    paymentMethod?: string;
    promotions?: Array<string> | Array<{}>;
    _id?: string;
    receiptId?: string;
    isCustomerSaved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
}