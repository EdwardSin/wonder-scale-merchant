import { WsModalService } from './ws-modal.service';
import { ElementRef, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
declare var $:any;

export class WsModalClass implements OnInit {
    @Input() id: string;
    @Input() item;
    @Input() closeCallback;
    
    private element;
    protected ngUnsubscribe: Subject<any> = new Subject;

    getItem(){
        return this.item;
    }

    constructor(protected modalService: WsModalService, protected el: ElementRef) {
        this.element = $(el.nativeElement);
    }

    ngOnInit(): void {
        let modal = this;
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }
        this.element.appendTo('body');
        this.modalService.add(this);
    }
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    open(): void {
        this.element.addClass('modalOpen');
        $('body').addClass('modal-open');
        $('.modal-open .modal-wrap').scrollTop(0);
    }
    close(): void {
        this.element.removeClass('modalOpen');
        $('body').removeClass('modal-open');
        if (this.closeCallback) {
            this.closeCallback();
        }
    }
    setElement(element) {
        this.item = element;
    }
}