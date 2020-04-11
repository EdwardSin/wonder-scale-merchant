import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsModalClass } from '@components/elements/ws-modal/ws-modal';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'image-upload-modal',
  templateUrl: './image-upload-modal.component.html',
  styleUrls: ['./image-upload-modal.component.scss']
})
export class ImageUploadModalComponent extends WsModalClass implements OnInit {

  imageSize = 0;
  environment = environment;
  uploadedFlag;
  uploading = new WsLoading;
  filesToUpload;
  @Input() id;
  @Input() type: 'user' | 'shop';
  @Input() item;
  uploadFunction: Function;
  @ViewChild('imageInput', { static: true }) imageInput: ElementRef;
  @ViewChild('imageScreen', { static: true }) imageScreen: ElementRef;
  @ViewChild('imageDiv', { static: true }) imageDiv: ElementRef;
  @ViewChild('imageInputCircle', { static: true }) imageInputCircle: ElementRef;
  @ViewChild('copyImage', { static: true }) copyImage: ElementRef;
  @ViewChild('profileUploadInput', { static: true }) profileUploadInput: ElementRef;

  imageInputScale;
  imageInputTranslate;
  imageInputCircleRadius;
  imageInputCirclePosition;
  UPLOAD_WIDTH_MAX = 0;
  UPLOAD_WIDTH_MIN = 0;
  UPLOAD_HEIGHT_MAX = 0;
  UPLOAD_HEIGHT_MIN = 0;

  constructor(modalService: WsModalService,
    el: ElementRef,
    private ref: ChangeDetectorRef,
    private authUserService: AuthUserService,
    private sharedUserService: SharedUserService,
    private authShopContributorService: AuthShopContributorService,
    private sharedShopService: SharedShopService,
    private authenticationService: AuthenticationService) {
    super(modalService, el);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.type == 'user') {
      this.uploadFunction = this.editUserForm;
    }
    else if (this.type == 'shop') {
      this.uploadFunction = this.editShopForm;
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setElement(element) {
    super.setElement(element);
    this.item = element;
  }


  closeModal(id) {
    this.profileUploadInput.nativeElement.value = '';
    this.filesToUpload = [];
    this.uploadedFlag = false;
    this.imageInput.nativeElement.src = '';
    this.imageInput.nativeElement.style.display = 'none';
    this.imageInput.nativeElement.style.left = 0;
    this.imageInput.nativeElement.style.top = 0;
    this.imageInputCircle.nativeElement.src = '';
    this.imageInputCircle.nativeElement.style.display = 'none';
    this.imageInputCircle.nativeElement.style.left = 0;
    this.imageInputCircle.nativeElement.style.top = 0;
    this.imageDiv.nativeElement.style.display = 'none';

    this.imageDiv.nativeElement.style.left = 0;
    this.imageDiv.nativeElement.style.top = 0;
    this.imageSize = 1;
    this.UPLOAD_WIDTH_MAX = 0;
    this.UPLOAD_WIDTH_MIN = 0;
    this.UPLOAD_HEIGHT_MAX = 0;
    this.UPLOAD_HEIGHT_MIN = 0;
    this.modalService.close(id);
  }
  renderCopyImage() {
    let renderWidth = 320;
    let renderHeight = 320;

    this.copyImage.nativeElement.src = getImagePortion(this.imageInputCircle.nativeElement,
      renderWidth, renderHeight,
      -this.imageInputCircle.nativeElement.offsetLeft * this.imageInputCircle.nativeElement.naturalWidth / this.imageInputCircle.nativeElement.width,
      -this.imageInputCircle.nativeElement.offsetTop * this.imageInputCircle.nativeElement.naturalHeight / this.imageInputCircle.nativeElement.height,
      this.imageInputCircle.nativeElement.naturalWidth / this.imageInputCircle.nativeElement.width);

    function getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
      /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
      //set up canvas for thumbnail
      var tnCanvas = document.createElement('canvas');
      var tnCanvasContext = tnCanvas.getContext('2d');
      tnCanvas.width = newWidth;
      tnCanvas.height = newHeight;

      /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
      var bufferCanvas = document.createElement('canvas');
      var bufferContext = bufferCanvas.getContext('2d');
      bufferCanvas.width = imgObj.naturalWidth;
      bufferCanvas.height = imgObj.naturalHeight;
      bufferContext.drawImage(imgObj, 0, 0);

      /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */

      tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio, 0, 0, newWidth, newHeight);
      return tnCanvas.toDataURL();
    }
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = UploadHelper.fileChangeEvent(fileInput);
    UploadHelper.readURL(this.filesToUpload[0], this.imageInput.nativeElement, () => {
      this.uploadedFlag = this.filesToUpload.length > 0;

      this.imageInputCircle.nativeElement.src = this.imageInput.nativeElement.src;
      this.imageDiv.nativeElement.style.display = 'block';
      this.imageInput.nativeElement.style.display = 'block';
      this.imageInputCircle.nativeElement.style.display = 'block';
      this.imageScreen.nativeElement.style.display = 'block';

      if (this.imageInput.nativeElement.width > this.imageInput.nativeElement.height) {
        widthImageSetting.bind(this)();
      }
      else {
        heightImageSetting.bind(this)();
      }
      this.UPLOAD_WIDTH_MAX = -this.imageInput.nativeElement.width + 320;
      this.UPLOAD_HEIGHT_MAX = -this.imageInput.nativeElement.height + 320;
      this.renderCopyImage();
    });
    this.dragElement(this.imageDiv.nativeElement);
    function widthImageSetting() {
      this.imageInput.nativeElement.style.width = 'auto';
      this.imageInput.nativeElement.style.height = '320px';
      this.imageInputCircle.nativeElement.style.width = 'auto';
      this.imageInputCircle.nativeElement.style.height = '320px';
    }
    function heightImageSetting() {
      this.imageInput.nativeElement.style.width = '320px';
      this.imageInput.nativeElement.style.height = 'auto';
      this.imageInputCircle.nativeElement.style.width = '320px';
      this.imageInputCircle.nativeElement.style.height = 'auto';
    }
  }

  resize() {
    this.UPLOAD_WIDTH_MAX = -this.imageInput.nativeElement.width + 320;
    this.UPLOAD_WIDTH_MIN = 0;
    this.UPLOAD_HEIGHT_MAX = -this.imageInput.nativeElement.height + 320;
    this.UPLOAD_HEIGHT_MIN = 0;

    if (this.imageInput.nativeElement.naturalWidth > this.imageInput.nativeElement.naturalHeight) {
      this.imageInput.nativeElement.style.height = 320 + this.imageSize + 'px';
      this.imageInputCircle.nativeElement.style.height = 320 + this.imageSize + 'px';
    }
    else {
      this.imageInput.nativeElement.style.width = 320 + this.imageSize + 'px';
      this.imageInputCircle.nativeElement.style.width = 320 + this.imageSize + 'px';
    }


    if (this.imageInput.nativeElement.offsetLeft < this.UPLOAD_WIDTH_MAX) {
      this.imageInput.nativeElement.style.left = this.UPLOAD_WIDTH_MAX + 'px';
      this.imageInputCircle.nativeElement.style.left = this.UPLOAD_WIDTH_MAX + 'px';
    }

    if (this.imageInput.nativeElement.offsetTop < this.UPLOAD_HEIGHT_MAX) {
      this.imageInput.nativeElement.style.top = this.UPLOAD_HEIGHT_MAX + 'px';
      this.imageInputCircle.nativeElement.style.top = this.UPLOAD_HEIGHT_MAX + 'px';
    }
    this.renderCopyImage();
  }
  selectImage() {
    this.profileUploadInput.nativeElement.click();
  }
  dragElement(element) {
    let self = this;
    let diffenceElementPositionOnScreenX = 0,
      diffenceElementPositionOnScreenY = 0,
      currentCursorPositionOnScreenX = 0,
      currentCursorPositionOnScreenY = 0,
      previousCursorPositionScreenX = 0,
      previousCursorPositionScreenY = 0;
    let backgroundImage = this.imageInput.nativeElement;
    let cropImage = this.imageInputCircle.nativeElement;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      currentCursorPositionOnScreenX = e.clientX;
      currentCursorPositionOnScreenY = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      diffenceElementPositionOnScreenX = currentCursorPositionOnScreenX - e.clientX;
      diffenceElementPositionOnScreenY = currentCursorPositionOnScreenY - e.clientY;
      previousCursorPositionScreenX -= diffenceElementPositionOnScreenX;
      previousCursorPositionScreenY -= diffenceElementPositionOnScreenY;
      currentCursorPositionOnScreenX = e.clientX;
      currentCursorPositionOnScreenY = e.clientY;

      if (self.UPLOAD_WIDTH_MIN < previousCursorPositionScreenX) {
        previousCursorPositionScreenX = self.UPLOAD_WIDTH_MIN;
      }
      if (self.UPLOAD_WIDTH_MAX > previousCursorPositionScreenX) {
        previousCursorPositionScreenX = self.UPLOAD_WIDTH_MAX;
      }
      if (self.UPLOAD_WIDTH_MIN >= previousCursorPositionScreenX && self.UPLOAD_WIDTH_MAX <= previousCursorPositionScreenX) {

        backgroundImage.style.left = previousCursorPositionScreenX + 'px';
        cropImage.style.left = previousCursorPositionScreenX + 'px';
      }

      if (self.UPLOAD_HEIGHT_MIN < previousCursorPositionScreenY) {
        previousCursorPositionScreenY = self.UPLOAD_HEIGHT_MIN;
      }
      if (self.UPLOAD_HEIGHT_MAX > previousCursorPositionScreenY) {
        previousCursorPositionScreenY = self.UPLOAD_HEIGHT_MAX;
      }
      if (self.UPLOAD_HEIGHT_MIN >= previousCursorPositionScreenY && self.UPLOAD_HEIGHT_MAX <= previousCursorPositionScreenY) {
        backgroundImage.style.top = previousCursorPositionScreenY + 'px';
        cropImage.style.top = previousCursorPositionScreenY + 'px';
      }
      self.renderCopyImage.bind(self)();
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  editUserForm() {
    let user = this.item;
    let image_blob = this.copyImage.nativeElement.src;
    this.uploading.start();

    this.authUserService.editProfile({ file: image_blob })
      .pipe(finalize(() => { this.uploadedFlag = false; this.uploading.stop() }))
      .subscribe(result => {
        user.profileImage = result['profileImage'];
        this.sharedUserService.user.next(user);
        this.closeModal(this.id);
      });
  }
  editShopForm() {
    let shop = this.item;
    var image_blob = this.copyImage.nativeElement.src;
    this.uploading.start();
    this.authShopContributorService.editProfile({ file: image_blob, remove_file: shop.profileImage })
      .pipe(finalize(() => { this.uploadedFlag = false; this.uploading.stop() }))
      .subscribe(result => {
        this.sharedShopService.shop.next(result['result']);
        this.closeModal(this.id);
      });
  }
}
