import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ws-left-nav',
  templateUrl: './ws-left-nav.component.html',
  styleUrls: ['./ws-left-nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsLeftNavComponent implements OnInit {
  @Input() get isNavOpen() { return this._isNavOpen };
  @Input() isMobileSize: boolean;
  @Input() offsetHeight: number = 0;
  @Output() isNavOpenChange: EventEmitter<boolean> = new EventEmitter;

  _isNavOpen: boolean;

  set isNavOpen(val) {
    this._isNavOpen = val;
    this.isNavOpenChange.emit(val);
  }

  constructor() {
  }
  
  ngOnInit() {
    if (window) {
      $('.main-nav-list').css({
        height: (window.innerHeight - 50) + 'px'
      });
    }
    if (window.innerWidth < 992) {
      this.isNavOpen = false;
    }
  }
}
