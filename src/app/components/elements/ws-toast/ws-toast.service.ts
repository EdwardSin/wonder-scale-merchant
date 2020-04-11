import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({   providedIn: 'root' })
export class WsToastService {

  static toastSubject = new Subject<any>();

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor() { }

  showTranslateToastMessage(message) {
    WsToastService.toastSubject.next(message);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
