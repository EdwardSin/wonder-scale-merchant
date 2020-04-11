declare var jQuery: any;

export class QRCodeBuilder{

    static URL = "https://www.wonderscale.com/";
    public static createQRcode(target, username, id, option = {}){
        let code = QRCodeBuilder.URL + username + '?ref=' + id;
        (<any>jQuery(target)).qrcode({width: option['width'] || 196, height: option['height']|| 196, foreground:"#000", 
        correctLevel: 0, 
        text: code, 
        src: 'https://assets.wonderscale.com/upload/images/icons/icon-qrcode.png'})
    }
    public static createPromotionQrCode(target, url, option = {}){
        let code = QRCodeBuilder.URL + url;
        (<any>jQuery(target)).qrcode({width: option['width'] || 196, height: option['height']|| 196, foreground:"#000", 
        correctLevel: 0, 
        text: code, 
        src: 'https://assets.wonderscale.com/upload/images/icons/icon-qrcode.png'})
    }
}