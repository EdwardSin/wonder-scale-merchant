import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[ngLazyLoadScroll]'
})
export class NgLazyLoadScrollDirective {
  @Output()
  public ngLazyLoadScroll: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
  @HostListener('scroll', ['$event.target']) 
  public onScroll(targetElement) {
    let currentScrollTop = targetElement.scrollTop;
    let scrollHeight = targetElement.scrollHeight;
    let offsetHeight = targetElement.offsetHeight;
    let isScrollTriggered = scrollHeight - offsetHeight - currentScrollTop < 10;
    if (isScrollTriggered) {
      this.ngLazyLoadScroll.emit(true);
    }
  }

}
