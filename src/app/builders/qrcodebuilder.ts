import { environment } from '@environments/environment';

declare var jQuery: any;

export class QRCodeBuilder {
    public static createQRcode(target, url, option = {}) {
        let code = url;
        return new Promise((resolve) => {
            (<any>jQuery(target)).qrcode({
                width: option['width'] || 196, height: option['height'] || 196, foreground: option['color'] || "#000",
                correctLevel: 0,
                text: code,
                src: 'assets/images/png/icon-with-profile-image-borderless.png',
                callback: function () {
                    if (option['callback']) {
                        option['callback']();
                    }
                    resolve();
                }
            });
        });
    }
    public static createPromotionQrCode(target, url, option = {}) {
        let code = url;
        (<any>jQuery(target)).qrcode({
            width: option['width'] || 196, height: option['height'] || 196, foreground: option['color'] || "#000",
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
    static renderProfileImageToQrcode(target, image, size) {
        let canvas = $(target).find('canvas')[0];
        if (canvas) {
          let context =(<HTMLCanvasElement>canvas).getContext('2d');
          let width = size / 3 * 46.7 / 70;
          let height = size / 3 * 46.7 / 70;
          let offsetInnerY = size / 3 * 6 / 70;
          let offsetX = size/2 - width/2;
          let offsetY = size/2 - height/2 - offsetInnerY;
          context.save();
          context.beginPath();
          context.arc(offsetX + width/2, offsetY + width/2, width/2, 0, 2*Math.PI);
          context.fill();
          context.clip();
          context.drawImage(image, offsetX, offsetY, width, height);
          context.restore();
        }
      }
}