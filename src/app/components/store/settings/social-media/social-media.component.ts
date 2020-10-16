import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
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
  info: string;
  form: FormGroup;
  selectedMedia = undefined;
  loading: WsLoading = new WsLoading;

  @Input() store;
  isMediaMax;
  error = '';
  editmedia;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private authStoreContributorService: AuthStoreContributorService,
    private ref: ChangeDetectorRef
  ) {
    this.loading.start();

    this.route.data.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.store = result['store'];
        DocumentHelper.setWindowTitleWithWonderScale('Social Media - Settings - ' + this.store.name);
        this.isMediaMax = this.isMediaMaximum();
        this.loading.stop();
      })
  }

  ngOnInit() {
  }

  editMedia(type, form, index) {
    var account = form.value[type];
    var obj = {
      type: type,
      value: account,
      index: index
    };
    if (validateMedia.bind(this)(type, account)) {
      this.authStoreContributorService
        .editMedia(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.store.media[index]['value'] = account;
          WsToastService.toastSubject.next({ content: "Media is updated!", type: 'success' });
          this.setEditMedia('');
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }

    function validateMedia(type, value) {
      if (!value || (value && value.trim() === '')) {
        this.error = 'Account is required!';
        return false;
      }
      else if (value.length > 30) {
        this.error = 'Account is too long!';
        return false;
      }
      else if (this.store.media.find(media => {return media.type === type && media.value === value})) {
        this.error = 'Account is existing!';
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

  addMedia(type, form) {
    let value = form.value.mediavalue;
    if (validateMedia.bind(this)(type, value)) {
      this.authStoreContributorService
        .addMedia({ type, value })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          if (!this.store.media) this.store.media = [];
          this.store.media.push({ type, value });
          this.selectedMedia = undefined;
          this.editmedia = '';
          this.error = '';
          this.isMediaMax = this.isMediaMaximum();
          WsToastService.toastSubject.next({ content: "Media is updated!", type: 'success' });
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
    function validateMedia(type, value) {
      if (!value || (value && value.trim() === '')) {
        this.error = 'Account is required!';
        return false;
      }
      else if (value.length > 30) {
        this.error = 'Account is too long!';
        return false;
      }
      else if (this.store.media.find(media => {return media.type === type && media.value === value})) {
        this.error = 'Account is existing!';
        return false;
      }
      return true;
    }
  }
  removeMedia(type, value) {
    this.authStoreContributorService
      .removeMedia({ type: type, value: value })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        _.remove(this.store.media, (x) => x.type == type && x.value == value);
        this.isMediaMax = this.isMediaMaximum();
        this.error = '';
        WsToastService.toastSubject.next({ content: "Media is removed successfully!", type: 'success' });
      }, (err) => {
        WsToastService.toastSubject.next({ content: "Media is failed to remove!", type: 'danger' });
      });
  }
  mediaChange() {
    this.error = '';
  }

  isMediaMaximum() {
    const MAX = 12;
    if (this.store && this.store.media) {
      return this.store.media.length > MAX;
    }
    return false;
  }
  ngOnDestroy() {
    this.ref.detach();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}