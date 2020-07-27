import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedNavbarService {
  isNavSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor() { }
}
