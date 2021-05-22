export class AddressBookItem{
    _id?: string;
    recipientName: string;
    phone: string;
    address: string;
    postcode: string;
    state: string;
    country: string = 'MYS';
    from: 'home' | 'office';
    isDefaultBilling?: boolean;
    isDefaultShipping?: boolean;
}