export class NotificationMessage {
    _id: string;
    data: {};
    from: string;
    type: 'invoice-paid' | 'invoice-approval';
    version: number;
    isRead: boolean;
    iewNewItem: boolean;
    createdAt: Date;
    updatedAt: Date;
}