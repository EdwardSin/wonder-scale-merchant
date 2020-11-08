import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';

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
    if (this._isNavOpen && this.isMobileSize) {
      $('body').css({
        overflow: 'hidden'
      })
    } else {
      $('body').css({
        overflow: 'auto'
      })
    }
  }

  constructor() {
  }
  
  ngOnInit() {
    if (window) {
      let isMobileSize = window.innerWidth < 992;
      $('.main-nav-list').css({
        height: (window.innerHeight - (isMobileSize ? 50 : 120)) + 'px'
      });
      $(window).on('resize', function () {
        $('.main-nav-list').css({
          height: (window.innerHeight - (isMobileSize ? 50 : 120)) + 'px'
        });
      })
    }
    if (window.innerWidth < 992) {
      this.isNavOpen = false;
    }
  }
}
