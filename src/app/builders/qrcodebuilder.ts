import { environment } from '@environments/environment';

declare var jQuery: any;

export class QRCodeBuilder {
    public static createQRcode(target, url, option = {}) {
        let code = url;
        return new Promise((resolve) => {
            (<any>jQuery(target)).qrcode({
                width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
                correctLevel: 0,
                text: code,
                src: 'assets/images/svg/icon-with-profile-image-borderless.svg'
            });
            resolve();
        });
    }
    public static createPromotionQrCode(target, url, option = {}) {
        let code = url;
        (<any>jQuery(target)).qrcode({
            width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
            correctLevel: 0,
            text: code,
            src: 'assets/images/svg/icon-with-profile-image-borderless.svg'
        })
    }
    public static toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      }
}