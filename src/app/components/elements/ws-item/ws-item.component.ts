import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { Item } from '@objects/item';
import { Currency } from '@objects/currency';
import { CurrencyService } from '@services/http/general/currency.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-item',
  templateUrl: './ws-item.component.html',
  styleUrls: ['./ws-item.component.scss']
})
export class WsItemComponent implements OnInit {
  @Input() item: Item;
  @Input() showDelete: boolean;
  @Input() showSeller: boolean;
  @Input() showRoute: boolean;
  @Input() showFollow: boolean;
  @Input() showSetting: boolean;
  @Input() showNew: boolean;
  @Input() showOffer: boolean;
  @Input() showSimilar: boolean = true;
  @Input() isModal: boolean;
  @Input() isSellerModal: boolean;
  @Input() scrollTargetObj;
  @Input() navigateImageLink: Function = () => { };
  @Input() navigateTextLink: Function = () => { };
  @Input() navigateSmallTextLink: Function = () => { };
  @ViewChild('freeSize', { static: true }) free_size_img: ElementRef;

  seller: Seller;
  seller_id: string;
  isFollow: boolean;
  isNavigated: boolean;
  selectedCurrencyCode: string;
  environment = environment;
  scroll$;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private modalService: WsModalService,
    private currencyService: CurrencyService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    if (this.showSeller) {
      if (this.item && this.item['seller']) {
        this.seller = this.item['seller'];
        this.seller_id = this.seller['_id'];
      }
    }
    if (this.free_size_img) {
      this.free_size_img.nativeElement.height = this.free_size_img.nativeElement.width;
    }
    this.currencyService.currencyRate
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(rates => {
      if (rates) {
        this.currencyService.currencyFullnameArray.forEach(key => {
          let currency = new Currency();
          currency.code = key;
          currency.rate = rates[key];
          currency.symbol = this.currencyService.currencySymbols[key];
          currency.fullname = this.currencyService.currencyFullnames[key];
          this.currencyService.currencies.push(currency);
        })
        this.ref.detectChanges();
      }
    });
    this.currencyService.selectedCurrency
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.selectedCurrencyCode = result;
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.item['profileImage'] = this.item.profileImages.length > 0 ? this.item.profileImages[this.item.profileImageIndex] :
        environment.IMAGE_URL + 'upload/images/img_not_available.png'
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.free_size_img.nativeElement.height = this.free_size_img.nativeElement.width;
  }
  openSellerModal(id, seller) {
    this.modalService.open(id);
    this.modalService.setElement(id, seller);
  }
  checkImage(item, url) {
    var s = document.createElement("IMG");
    s['src'] = url;
    item['profileImage'] = url;
    s.onerror = function () {
      item['profileImage'] = environment.IMAGE_URL + "/assets/images/png/img_not_available.png";
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

export class Seller {
  name: string;
}