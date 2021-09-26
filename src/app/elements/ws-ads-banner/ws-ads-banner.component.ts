import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-ads-banner',
  templateUrl: './ws-ads-banner.component.html',
  styleUrls: ['./ws-ads-banner.component.scss']
})
export class WsAdsBannerComponent implements OnInit {
  @Input() isUpload: boolean;
  @Input() item;
  @Input() service;
  @Input() isNavigable: boolean;
  @Output() onImageChange: EventEmitter<any> = new EventEmitter();
  environment = environment;
  uploadImages = [];
  imageUrl = '';
  private clicks = new Subject;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private ref: ChangeDetectorRef) { 
    this.clicks.pipe(
      debounceTime(500), takeUntil(this.ngUnsubscribe)
    ).subscribe(e => {
      this.service.clickAdvertisement(this.item._id).subscribe();
    })
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
      });
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
  ngOnInit(): void {
  }

}
