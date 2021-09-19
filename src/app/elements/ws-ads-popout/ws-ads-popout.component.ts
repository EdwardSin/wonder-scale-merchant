import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-ads-popout',
  templateUrl: './ws-ads-popout.component.html',
  styleUrls: ['./ws-ads-popout.component.scss'],
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0}),
        animate('.1s', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({ opacity: 1}),
        animate('.1s', style({opacity: 0}))
      ])
    ])
  ]
})
export class WsAdsPopoutComponent implements OnInit {
  @Input() isUpload: boolean;
  @Input() item;
  @Input() isOpen: boolean;
  @Input() isModal: boolean;
  @Input() isNavigable: boolean;
  @Input() onCloseCallback: Function;
  @Input() service;
  @Output() onImageChange: EventEmitter<any> = new EventEmitter();
  @Output() onOpenChange: EventEmitter<boolean> = new EventEmitter();
  imageUrl: string = '';
  uploadImages = [];
  environment = environment;
  private clicks = new Subject;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor() { 
    this.clicks.pipe(
      debounceTime(500), takeUntil(this.ngUnsubscribe)
    ).subscribe(e => {
      this.service.clickAdvertisement(this.item._id)
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      setTimeout(() => {
        if (this.item.imageUrl && this.item.imageUrl.startsWith('upload/')) {
          this.imageUrl = environment.IMAGE_URL + this.item.imageUrl;
        } else if (this.item.imageUrl) {
          this.imageUrl = this.item.imageUrl;
        } else {
          this.imageUrl = '';
        }
      })
    }
  }
  onImageUpload(event){
    this.imageUrl = event[0].url;
    this.onImageChange.emit(event);
  }
  onClickUpload() {
    if (this.isUpload) {
      document.getElementById('imageAdsUploadInput').click();
    } else {
      if (this.service) {
        this.clicks.next();
      }
    }
  }
  onModalClose () {
    this.isOpen = false;
    this.onOpenChange.emit(this.isOpen);
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }
  ngOnInit(): void {
  }

}
