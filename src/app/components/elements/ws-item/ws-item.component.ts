import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { Item } from '@objects/item';
import { Currency } from '@objects/currency';
import { CurrencyOption } from '@objects/currency.option';
import { CurrencyService } from '@services/http/general/currency.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-item',
  templateUrl: './ws-item.component.html',
  styleUrls: ['./ws-item.component.scss']
})
export class WsItemComponent implements OnInit {
  Currency = Currency;
  currencyOption: CurrencyOption = new CurrencyOption;
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
    .subscribe(result => {
      if (result) {
        this.currencyOption.currencies = result;
        this.currencyService.selectedCurrency
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(result => {
            if (result) {
              this.currencyOption.target_currency = result;
              this.currencyOption.symbol = this.currencyOption.currencySymbols[result];
              this.currencyOption.rate = this.currencyOption.currencies[result];
              this.ref.detectChanges();
            }
          });
        this.ref.detectChanges();
      }
    });
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