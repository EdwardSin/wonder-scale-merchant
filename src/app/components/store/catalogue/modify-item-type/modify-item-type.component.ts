import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { ColorService } from '@services/general/color.service';
import { environment } from '@environments/environment';
import { Subject, from, forkJoin, of } from 'rxjs';
import { takeUntil, finalize, mergeMap, map } from 'rxjs/operators';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '@objects/item';
import * as _ from 'lodash';
import { SharedCategoryService } from '@services/shared/shared-category.service';

@Component({
  selector: 'app-modify-item-type',
  templateUrl: './modify-item-type.component.html',
  styleUrls: ['./modify-item-type.component.scss', '../modify-item/modify-item.component.scss']
})
export class ModifyItemTypeComponent implements OnInit {
  itemId;
  itemTypesForm: FormGroup;
  environment = environment;
  colors = [];
  currentItem: Item;
  itemTypeLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedCategoryService: SharedCategoryService,
    private authItemContributorService: AuthItemContributorService,
    private colorService: ColorService) {  
      this.loading.start();
      this.itemTypesForm = WSFormBuilder.createItemTypesGroup();
      this.colors = this.colorService.colors;
  }
  ngOnInit(): void {
    this.getItem();
  }
  onItemTypeClicked(id){
    document.getElementById(id).click();
  }
  onItemTypeImageUploaded(event, i) {
    let formArray = this.itemTypesForm.get('itemTypes') as FormArray;
    let formGroup = formArray.controls[i] as FormGroup;
    formGroup.controls['images'].setValue(_.uniq([...formGroup.controls['images'].value, ...event]));
  }
  getItem() {
    this.itemId = this.route.snapshot.queryParams['id'];
    if (this.itemId) {
      this.loading.start();
      this.authItemContributorService.getItemById(this.itemId)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => { _.delay(() => this.loading.stop(), 500)}))
        .subscribe(result => {
          if(result) {
            this.currentItem = result['result'];
            this.setupItemTypeForm(this.currentItem);
          }
        })
    }
  }
  setupItemTypeForm(item) {
    let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
    item.types.forEach(type => {
      let form = WSFormBuilder.createItemTypeForm();
      if (type.images) {
        type.images = type.images.map(image => {return {name: image, type: 'url'}});
      }
      form.patchValue(type);
      itemTypes.push(form);
      itemTypes.controls[0]['controls']['price'].disable();
      itemTypes.controls[0]['controls']['discount'].disable();
    });
  }
  uploadItemImages(allImages, images, itemTypeId) {
    images.forEach(image => image.loading = true);
    return from(images)
    .pipe(mergeMap(image => {
      let index = allImages.indexOf(image);
      let obj = {
        id: image['id'],
        file: image['base64'],
        itemId: this.itemId,
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
      itemTypes.push(WSFormBuilder.createItemTypeForm());
    } else {
      WsToastService.toastSubject.next({ content: 'Max 15 items', type: 'danger' });
    }
  }
  editItemTypes() {
    if(this.validateBasicForm()) {
      let obj = {
        itemId: this.currentItem['_id'],
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
      this.authItemContributorService.editItemTypes(obj).pipe(mergeMap(result => {
        let itemTypes = result['result']['types'];
        return forkJoin(from(itemTypes.map(type => type._id)).pipe(mergeMap((itemTypeId, index) => {
          let allImages = this.itemTypesForm.get('itemTypes').value[index]['images'];
          let images = allImages.filter(image => image.type == 'blob');
          return images.length ? this.uploadItemImages(allImages, images, itemTypeId): of(0);
        })))
      }), takeUntil(this.ngUnsubscribe),
      finalize(() => this.itemTypeLoading.stop())).subscribe(result => {
          this.sharedCategoryService.refreshCategories();
          this.router.navigate([], {queryParams: {id: null, modal: null}, queryParamsHandling: 'merge'});
      });
    }
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
        });
      }
    } else {
      let itemTypes = this.itemTypesForm.get('itemTypes') as FormArray;
      itemTypes.removeAt(itemTypes.controls.indexOf(type));
    }
  }
  validateBasicForm() {
    this.itemTypesForm.get('itemTypes')['controls'].forEach(formGroup => {
      let price = formGroup.get('price');
      let discount = formGroup.get('discount');
      let weight = formGroup.get('weight');
      let quantity = formGroup.get('quantity');
      let priceRegex = /^\d*(?:\.\d{1,2})?$/;
      let intergerRegex = /^\d+$/;
      if (price.value && !priceRegex.test(price.value)){
        WsToastService.toastSubject.next({ content: 'Price is invalid!', type: 'danger' });
        return false;
      } 
      else if (discount.value && (!priceRegex.test(discount.value) || +discount.value > 100)){
        WsToastService.toastSubject.next({ content: 'Discount is invalid!', type: 'danger' });
        return false;
      }
      else if (weight.value && !priceRegex.test(weight.value)){
        WsToastService.toastSubject.next({ content: 'Weight is invalid!', type: 'danger' });
        return false;
      }
      else if (quantity.value && !intergerRegex.test(quantity.value)){
        WsToastService.toastSubject.next({ content: 'Quantity is invalid!', type: 'danger' });
        return false;
      } else if(quantity.value && +quantity.value > 999999) {
        WsToastService.toastSubject.next({ content: 'Quantity should less than 999999!', type: 'danger' });
        return false;
      }
    })
    return true;
  }
  onColorValueChanged($event, formGroup) {
    if (this.colors.includes($event) || /^#([0-9A-F]{3}){1,2}$/i.test($event.value)) {
      formGroup.controls['hexColor'].setValue($event.value);
    } else {
      WsToastService.toastSubject.next({content: 'Please enter a valid hex color code!', type: 'danger'});
    }
  }
  navigateToEditItem(){
    this.router.navigate([], {queryParams: { id: this.itemId, modal: 'modify-item' }, queryParamsHandling: 'merge'});
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
}