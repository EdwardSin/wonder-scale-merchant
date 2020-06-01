declare var jQuery: any;

export class QRCodeBuilder {

    static URL = "https://www.wonderscale.com/";
    public static createQRcode(target, username, id, option = {}) {
        let code = QRCodeBuilder.URL + 'shop?id=' + id;
        return new Promise((resolve) => {
            (<any>jQuery(target)).qrcode({
                width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
                correctLevel: 0,
                text: code,
                src: 'assets/images/png/icon-with-profile-image-borderless.png'
            });
            resolve();
        });
    }
    public static createPromotionQrCode(target, url, option = {}) {
        let code = QRCodeBuilder.URL + url;
        (<any>jQuery(target)).qrcode({
            width: option['width'] || 196, height: option['height'] || 196, foreground: "#000",
            correctLevel: 0,
            text: code,
            src: 'assets/images/png/icon-with-profile-image-borderless.png'
        })
    }
}