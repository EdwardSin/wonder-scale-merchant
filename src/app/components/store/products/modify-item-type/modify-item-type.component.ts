import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { ColorService } from '@services/general/color.service';
import { environment } from '@environments/environment';
import { Subject, from, forkJoin, of } from 'rxjs';
import { takeUntil, finalize, mergeMap, map } from 'rxjs/operators';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Item } from '@objects/item';
import * as _ from 'lodash';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';

@Component({
  selector: 'modify-item-type',
  templateUrl: './modify-item-type.component.html',
  styleUrls: ['./modify-item-type.component.scss', '../modify-item/modify-item.component.scss']
})
export class ModifyItemTypeComponent implements OnInit {
  @Input('itemForm') itemForm;
  @Input('item') currentItem: Item;
  @Output('onSaveClick')  onSaveClick: EventEmitter<Function> = new EventEmitter();
  @Output('validation') validateItemTypesForm: EventEmitter<Function> = new EventEmitter();
  @Output('isRefresh') isRefresh: EventEmitter<boolean> = new EventEmitter();
  itemTypesForm: FormGroup;
  environment = environment;
  colors = [];
  itemTypeLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private uploadHelper: UploadHelper,
    private authItemContributorService: AuthItemContributorService,
    private colorService: ColorService) {  
      this.loading.start();
      this.itemTypesForm = WsFormBuilder.createItemTypesGroup();
      this.colors = this.colorService.colors;
  }
  ngOnInit(): void {
    this.validateItemTypesForm.emit(this.validateBasicForm.bind(this));
    this.onSaveClick.emit(this.editItemTypes.bind(this));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['currentItem']) {
      this.setupItemTypeForm(this.currentItem);
    }
  }
  onItemTypeClicked(id){
    document.getElementById(id).click();
  }
  onItemTypeImageUploaded(event, i) {
    for (let image of event) {
      const result = this.uploadHelper.validate(image.file, true, environment.MAX_IMAGE_SIZE_IN_MB);
      if (result.result) {
        let formArray = this.itemTypesForm.get('itemTypes') as FormArray;
        let formGroup = formArray.controls[i] as FormGroup;
        formGroup.controls['images'].setValue(_.uniq([...formGroup.controls['images'].value, image]));
      } else {
        WsToastService.toastSubject.next({ content: result.error, type: 'danger'});
      }
    }
  }
  onItemTypeImageOverflow() {
    WsToastService.toastSubject.next({ content: 'Max 3 images are uploaded!', type: 'danger'});
  }
  setupItemTypeForm(item) {
    this.itemTypesForm = WsFormBuilder.createItemTypesGroup();
    let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
    if (item) {
      item.types.forEach(type => {
        let form = WsFormBuilder.createItemTypeForm();
        if (type.images) {
          type.images = type.images.map(image => {return {name: image, type: 'url'}});
        }
        form.patchValue(type);
        itemTypes.push(form);
      });
    }
    this.loading.stop();
  }
  uploadItemImages(allImages, images, itemTypeId, itemId) {
    images.forEach(image => image.loading = true);
    return from(images)
    .pipe(
      mergeMap(image => {
      let index = allImages.findIndex(_image => _image.base64 === image['base64']);
      let obj = {
        id: image['id'],
        file: image['base64'],
        itemId,
        itemTypeId,
        position: index
      }
      return this.authItemContributorService.editItemTypeImage(obj);
    }),
      map(result => {
        this.doneUpload(images, result['id'], result['filename'])
      }));
  }
  removeItemTypeImage(filename, itemTypeControl, itemType) {
    var file = ImageHelper.getUploadProfileItem(itemType.images, filename);
    if (file) {
      if(file.type == 'blob') {
        _.remove(itemType.images, (x) => x.name == filename);
        itemTypeControl.controls['images'].setValue(itemType.images);
        file['done'] = false;
      }
      else {
        let result = confirm('Are you sure to remove?\nThis action cannot be redone.');
        if (result) {
          let obj = {
            itemId: this.currentItem['_id'],
            itemTypeId: itemType._id,
            filename: file.name
          }
          this.authItemContributorService.removeImage(obj).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
              itemType.images = itemType.images.filter(x => x.name != filename);
              itemTypeControl.controls['images'].setValue(itemType.images);
              this.isRefresh.emit(true);
            });
        }
      }
    } else {
      WsToastService.toastSubject.next({content: 'Image is not found!', type: 'danger'});
    } 
  }
  addNewItemType() {
    let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
    if (itemTypes.controls.length < 15) {
      itemTypes.push(WsFormBuilder.createItemTypeForm());
    } else {
      WsToastService.toastSubject.next({ content: 'Max 15 items', type: 'danger' });
    }
  }
  editItemTypes(id) {
    let obj = {
      itemId: id,
      types: this.itemTypesForm.get('itemTypes').value.map(result => {
          let images = result.images.filter(image => image.type == 'url')
                      .map(image => image.name);
          return {
            ...result,
            images
          }
      })
    }
    this.itemTypeLoading.start();
    return this.authItemContributorService.editItemTypes(obj).pipe(mergeMap(result => {
      let itemTypes = result['result']['types'];
      if (itemTypes.length) {
        return forkJoin([from(itemTypes.map(type => type._id)).pipe(mergeMap((itemTypeId, index) => {
          let allImages = this.itemTypesForm.get('itemTypes').value[index]['images'];
          let images = allImages.filter(image => image.type == 'blob');
          return images.length ? this.uploadItemImages(allImages, images, itemTypeId, id): of(0);
        }))])
      }
      return of(0);
    }), takeUntil(this.ngUnsubscribe),
    finalize(() => this.itemTypeLoading.stop()));
  }
  removeItemType(type) {
    if (type.value._id) {
      if (confirm('Are you sure to remove item?\nThis action cannot redo.')){
        let obj = {
          ...type.value,
          itemId: this.currentItem['_id']
        }
        this.authItemContributorService.removeItemType(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
          itemTypes.removeAt(itemTypes.controls.indexOf(type));
          this.isRefresh.emit(true);
        });
      }
    } else {
      let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
      itemTypes.removeAt(itemTypes.controls.indexOf(type));
    }
  }
  validateBasicForm() {
    let controls = this.itemTypesForm.get('itemTypes')['controls'];
    for (let i = 0; i < controls.length; i++) {
      let formGroup = controls[i];
      let name = formGroup.get('name');
      let price = formGroup.get('price');
      // let discount = formGroup.get('discount');
      let weight = formGroup.get('weight');
      let quantity = formGroup.get('quantity');
      let priceRegex = /^\d*(?:\.\d{1,2})?$/;
      let intergerRegex = /^\d+$/;
      let currentIndex = i + 1;
      
      if (!name.value || !name.value.trim()) {
        WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - name is required!', type: 'danger' });
        return false;
      }
      if (price.value && !priceRegex.test(price.value)) {
        WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - price is invalid!', type: 'danger' });
        return false;
      }
      // else if (discount.value && (!priceRegex.test(discount.value) || +discount.value > 100)) {
      //   WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - discount is invalid!', type: 'danger' });
      //   return false;
      // }
      else if (weight.value && !priceRegex.test(weight.value)) {
        WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - weight is invalid!', type: 'danger' });
        return false;
      }
      else if (quantity.value && !intergerRegex.test(quantity.value)) {
        WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - quantity is invalid!', type: 'danger' });
        return false;
      } else if(quantity.value && +quantity.value > 999999) {
        WsToastService.toastSubject.next({ content: 'Type ' + currentIndex + ' - quantity should less than 999999!', type: 'danger' });
        return false;
      }
    }
    let listOfName = this.itemTypesForm.get('itemTypes')['controls'].map(formGroup => {
      return formGroup.value.name.trim();
    });
    // Check has duplicate type name
    if (!listOfName.every((e, i, a) => a.indexOf(e) === i)) {
      WsToastService.toastSubject.next({ content: 'No duplicated type is allowed!', type: 'danger'});
      return false;
    }
    return true;
  }
  onColorValueChanged($event, formGroup) {
    if (this.colors.includes($event) || /^#([0-9A-F]{3}){1,2}$/i.test($event.value)) {
      formGroup.controls['hexColor'].setValue($event.value);
    } else {
      WsToastService.toastSubject.next({content: 'Please enter a valid hex color code!', type: 'danger'});
    }
  }
  doneUpload(allItems, _id, filename) {
    var item = allItems.find(item => item.id == _id);
    if (item) {
      item.done = true;
      item.filename = filename;
    }
  }
  dropItemTypeImages(event:CdkDragDrop<string[]>, items){
    moveItemInArray(items, event.previousIndex, event.currentIndex);
  }
  itemType(i) {
    return this.itemTypesForm.controls.itemTypes.value[i];
  }
  async onSelect(event, itemTypeImages) {
    let items = await this.uploadHelper.fileChangeEvent(event.addedFiles);
    for(let item of items) {
      if (!itemTypeImages.includes(item) && itemTypeImages.length < 3) {
        const result = this.uploadHelper.validate(item.file, true, environment.MAX_IMAGE_SIZE_IN_MB);
        if (result.result) {
          itemTypeImages.push(item);
        } else {
          WsToastService.toastSubject.next({ content: result.error, type: 'danger'});
        }
      } else {
        WsToastService.toastSubject.next({ content: 'Maximum images are uploaded!', type: 'danger'});
        break;
      }
    }
  }
  onDragEnter(event) {
    $('.upload-profile-images__drop-area').css({'z-index': 2});
  }
  onDrop(event) {
    $('.upload-profile-images__drop-area').css({'z-index': 0});
  }
  onChoose = () => {
    // using anonymous function to access the current prototype variable
    $('.upload-profile-images__container').css({'z-index': 3});
  }
  onUnchoose = (event) => {
    // using anonymous function to access the current prototype variable
    $('.upload-profile-images__container').css({'z-index': 0});
    $('.upload-profile-images__drop-area').css({'z-index': 0});
  }
}
