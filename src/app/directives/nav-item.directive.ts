import { Directive, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';

@Directive({
  selector: '[wsNavItem]'
})
export class NavItemDirective {
  delayFunc;
  constructor(private el: ElementRef) { 
  }
  @HostListener('mouseenter') onMouseEnter() {
    clearTimeout(this.delayFunc);
    let top = $(this.el.nativeElement).offset().top - $(window).scrollTop();
    let maxHeight = $(window).innerHeight() - ($(this.el.nativeElement).offset().top - $(window).scrollTop()) - 41;
    let minHeight = $(window).innerHeight() - 41;
    this.el.nativeElement.classList.add('hovered');
    $(this.el.nativeElement).find('.ws-main-nav-sub-list').css({
      top: maxHeight > minHeight ? 41 : top + 'px',
      'max-height': window.innerWidth < 992 ? '100%' : maxHeight > 500 ? 500 : (maxHeight > minHeight ? minHeight : maxHeight) + 'px'
    });
  }
  @HostListener('mouseleave') onMouseLeave () {
    this.delayFunc = setTimeout(() => {
      $(this.el.nativeElement).removeClass('hovered');
    }, 50);
  }
}
