import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WsMessageBarService } from './ws-message-bar.service';

@Component({
  selector: 'ws-message-bar',
  animations: [
    trigger('slideDown', [
      state('down', style({ opacity: 1, "margin-top": "0px" })),
      transition('void => down', [
        style({ opacity: 0, "margin-top": "-20px" }),
        animate('.2s ease-out')
      ]),
      transition('down => void', [
        animate('.2s ease-out', style({ opacity: 0, "margin-top": "-20px" }))
      ])
    ]
    )
  ],
  templateUrl: './ws-message-bar.component.html',
  styleUrls: ['./ws-message-bar.component.scss']
})
export class WsMessageBarComponent implements OnInit {
  header: string = '';
  message: string = '';
  type: WsMessageBarType = 'default';
  onLinkClick: Function;
  linkLabel: string = '';
  @Input() isShown: boolean = false;
  @ViewChild('wsMessage', { static: true }) wsMessage: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor() { }

  ngOnInit(): void {
    WsMessageBarService.toastSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isShown = true;
      if (result.message) {
        this.message = result.message;
      }
      if (result.header) {
        this.header = result.header;
      }
      if (result.linkLabel) {
        this.linkLabel = result.linkLabel;
      }
      if (result.onLinkClick) {
        this.onLinkClick = result.onLinkClick;
      }
      if (result.type) {
        this.type = result.type;
      }
    });
    WsMessageBarService.close.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.remove();
    });
  }
  toast() {
    
  }
  remove() {
    this.isShown = false;
  }
}

type WsMessageBarType = 'default' | 'success' | 'danger' | 'info' | 'warning';