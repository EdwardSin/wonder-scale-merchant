import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[modal]'
})
export class ModalDirective {

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

  ngOnDestroy() {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

}
