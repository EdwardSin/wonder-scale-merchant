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
      $(window).on('resize', function () {
        let isMobileSize = window.innerWidth < 992;
        $('.main-nav-list').css({
          height: (window.innerHeight - (isMobileSize ? 50 : 91)) + 'px'
        });
      })
    }
    if (window.innerWidth < 992) {
      this.isNavOpen = false;
    }
    $('.ws-main-nav-list-item').hover(function (event) {
      let top = $(event.target).offset().top - $(window).scrollTop();
      $(event.target).next('.ws-main-nav-sub-list').css({
        top: top + 'px'
      });
    });
  }
}
