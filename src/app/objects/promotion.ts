import { Store } from "./store"

export class Promotion {
    store: string | Store;
    title: string;
    option: 'percentage' | 'fixed_amount';
    value: number;
    status: 'active' | 'inactive'
    isEnabled: Boolean;
    activeDate: Date;
    expiryDate: Date;
    isExpiryDate: Boolean;
    quantity?: number;
}