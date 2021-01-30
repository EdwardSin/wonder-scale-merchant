import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({   providedIn: 'root' })
export class WsMessageBarService {

  static toastSubject: Subject<any> = new Subject<any>();
  static close: Subject<boolean> = new Subject<boolean>();

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor() { }

  showTranslateToastMessage(message) {
    WsMessageBarService.toastSubject.next(message);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
