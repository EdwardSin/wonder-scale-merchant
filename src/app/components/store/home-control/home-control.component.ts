import { Component, OnInit } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-control',
  templateUrl: './home-control.component.html',
  styleUrls: ['./home-control.component.scss']
})
export class HomeControlComponent implements OnInit {
  storeUsername: string = '';
  store;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService) { }

  ngOnInit(): void {
    this.storeUsername = this.sharedStoreService.storeUsername;
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
    })
  }
  isStoreDetailsCompleted() {
    return this.store.profileImage && this.store.description &&
            this.isContactDetailsCompleted() &&
            this.isLocationDetailsCompleted() &&
            this.store.openingInfoType;
  }
  isContactDetailsCompleted() {
    return this.store.email && this.store.email.length ||
          this.store.website && this.store.website.length ||
          this.store.phone && this.store.phone.length ||
          this.store.media && this.store.media.length;
  }
  isLocationDetailsCompleted() {
    return this.store.showAddress && this.store.location &&
          this.store.location.coordinates[0] !== 0 &&
          this.store.location.coordinates[0] !== 0 &&
          this.store.fullAddress &&
          this.store.fullAddress.address &&
          this.store.fullAddress.state &&
          this.store.fullAddress.postcode &&
          this.store.fullAddress.country;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
