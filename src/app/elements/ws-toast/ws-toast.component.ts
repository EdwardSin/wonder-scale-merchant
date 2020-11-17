import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WsToastService } from './ws-toast.service';
declare var $: any;

@Component({
  selector: 'ws-toast',
  templateUrl: './ws-toast.component.html',
  styleUrls: ['./ws-toast.component.scss']
})
export class WsToastComponent implements OnInit {
  toastItems = [];
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(@Inject(PLATFORM_ID) private platformId) {
    if (isPlatformBrowser(this.platformId)) {
      WsToastService.toastSubject
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((message: MessageType) => {
          const toastContainer = document.getElementById('toast-container');
          const newSpan = document.createElement('div');
          newSpan.innerHTML = message['content'];
          newSpan.className = 'toast';
          newSpan.className += ' ' + (message['type'] || 'default');

          toastContainer.appendChild(newSpan);
          $(newSpan)
            .delay(100)
            .queue(function () {
              $(this)
                .addClass('show')
                .dequeue();
            });
          $(newSpan)
            .delay(3000)
            .queue(function () {
              $(this)
                .addClass('hide')
                .dequeue();
            });
          $(newSpan)
            .delay(200)
            .queue(function () {
              $(this)
                .remove()
                .dequeue();
            });
        });
    }
  }

  ngOnInit() { }
  ngAfterViewInit() {

  }

  ngDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
export class MessageType {
  type: 'success' | 'danger' | 'warning' | 'info' | 'default' = 'default';
  content: string;
  title: string;
}
