import { Injectable } from '@angular/core';
import { PaymentCard } from '@objects/payment-card';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedCardService {
    cards: BehaviorSubject<PaymentCard[]> = new BehaviorSubject<PaymentCard[]>(null);


    constructor() { }


}
