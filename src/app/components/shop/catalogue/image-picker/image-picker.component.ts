import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  url: string = '';
  images = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private route: ActivatedRoute,
    private authItemContributorService: AuthItemContributorService) { }

  ngOnInit() {
  }
  getItem() {
    let item_id = this.route.snapshot.queryParams['id'];
    if (item_id) {
      this.authItemContributorService.getItemById(item_id).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          if (result) {
            this.images = result['profile_images'];
          }
        })
    }
  }

}
