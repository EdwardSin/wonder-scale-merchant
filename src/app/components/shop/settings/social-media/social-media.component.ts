import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  info: String;
  form: FormGroup;
  selectedMedia = undefined;
  loading: WsLoading = new WsLoading;

  @Input() shop;
  isMediaMax;
  error = '';

  fbmedia;
  instamedia;
  twittermedia;
  wechatmedia;
  weibomedia;
  whatsappmedia;
  editmedia;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private authShopContributorService: AuthShopContributorService,
    private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.loading.start();

    this.route.data.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.shop = result['shop'];
        DocumentHelper.setWindowTitleWithWonderScale('Social Media | Settings | ' + this.shop.name);
        this.isMediaMax = this.isMediaMaximum();
        this.loading.stop();
      })
  }

  ngOnInit() {
  }

  editMedia(media, form, index) {
    var account = form.value[media];
    var obj = {
      mediaType: media,
      value: account,
      index: index
    };
    if (validateMedia.bind(this)(account)) {
      this.authShopContributorService
        .editMedia(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.shop.media[index]['value'] = account;
          WsToastService.toastSubject.next({ content: "Media is updated!", type: 'success' });
          this.setEditMedia('');
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }

    function validateMedia(account) {
      if (!account || (account && account.trim() === '')) {
        this.error = 'Account is required!';
        return false;
      }
      else if (account.length > 30) {
        this.error = 'Account is too long!';
        return false;
      }
      return true;
    }
  }
  isEditMedia(name) {
    return this.editmedia == name;
  }
  setEditMedia(name) {
    this.editmedia = name;
    this.ref.detectChanges();
    $('#' + name + 'input').focus();
  }

  addMedia(media, account) {
    if (validateMedia.bind(this)(account)) {
      this.authShopContributorService
        .addMedia({ mediaType: media, value: account })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          if (!this.shop.media) this.shop.media = [];
          this.shop.media.push({ mediaType: media, value: account });
          this.selectedMedia = undefined;
          this.fbmedia = '';
          this.instamedia = '';
          this.twittermedia = '';
          this.wechatmedia = '';
          this.weibomedia = '';
          this.whatsappmedia = '';
          this.editmedia = '';
          this.isMediaMax = this.isMediaMaximum();
          WsToastService.toastSubject.next({ content: "Media is updated!", type: 'success' });
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
    function validateMedia(account) {
      if (!account || (account && account.trim() === '')) {
        this.error = 'Account is required!';
        return false;
      }
      else if (account.length > 30) {
        this.error = 'Account is too long!';
        return false;
      }
      return true;
    }
  }
  removeMedia(type, value) {
    this.authShopContributorService
      .removeMedia({ mediaType: type, value: value })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        _.remove(this.shop.media, (x) => x.mediaType == type && x.value == value);
        this.isMediaMax = this.isMediaMaximum();
        WsToastService.toastSubject.next({ content: "Media is updated!", type: 'success' });

      }, (err) => {
        WsToastService.toastSubject.next({ content: "Media is not updated!", type: 'danger' });
      });
  }
  mediaChange() {
    this.error = '';
  }

  isMediaMaximum() {
    const MAX = 12;
    if (this.shop && this.shop.media) {
      return this.shop.media.length > MAX;
    }
    return false;
  }
  ngOnDestroy() {
    this.ref.detach();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}