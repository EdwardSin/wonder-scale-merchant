
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UploadHelper {

    // public static fileChangeEvent(fileInput: any) {
    //     return <Array<File>>fileInput.target.files;
    // }

    // public static readURL(file, imgTarget, callback?: Function) {
    //     if (file && this.validatePhoto(file)) {
    //         var reader = new FileReader();
    //         reader.onload = function(e) {
    //             var image = imgTarget;
    //             image["src"] = e["target"]["result"];
    //             image.onload = function(){
    //                 if(callback){
    //                     callback();}
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // }
    // public static showImages(array = [], imageFiles, callback, isPreLoad = false) {
    //     var reader;
    //     var images = array;
    //     for (let image of imageFiles) {
    //         if (image && this.validatePhoto(image)) {
    //             reader = new FileReader();
    //             reader.onload = function (e) {
    //                     var img = {
    //                         name: image['name'],
    //                         file: image,
    //                         done: isPreLoad,
    //                         type: 'blob',
    //                         base64: reader.result
    //                     };
    //                     if(image['name'] && image['name'].split('.').length > 1){
    //                         img['ext'] = image['name'].split('.').pop();
    //                     }
    //                     images.push(img);
    //                     callback(img);
    //             }
    //             reader.readAsDataURL(image);
    //         }
    //     }
    //     return images;
    // }
    // public static notificationIfOver(ableToUploadProfileFiles, preProfileFiles) {
    //     if (ableToUploadProfileFiles.length == 0 || preProfileFiles.length > ableToUploadProfileFiles.length) {
    //         WsToastService.toastSubject.next({ content: "Max images are uploaded!" });
    //     }
    // }
    // public static getMaxAbleUploadProfileFiles(existProfileItemsNumber, preprofileFiles, MAX = 1) {
    //     var ableUploadSpaces = MAX - existProfileItemsNumber;
    //     var ableUploadProfileFiles = [];
    //     for (let i = 0; i < ableUploadSpaces; i++) {
    //         if (preprofileFiles[i]) {
    //             ableUploadProfileFiles.push(preprofileFiles[i]);
    //         }
    //         else {
    //             break;
    //         }
    //     }
    //     return ableUploadProfileFiles;
    // }
    // private static validatePhoto(file) {
    //     var fileTypes = [
    //         'image/jpeg',
    //         'image/jpeg',
    //         'image/jpg',
    //         'image/png'
    //     ]
    //     //let MB = 5;
    //     //var OVER_SIZE_MB = MB * 1000 * 1000;
    //     // if (file.size > OVER_SIZE_MB) {
    //     //     WsToastService.toastSubject.next({ content: "File size limit " + MB + "mb!" });
    //     //     return false;
    //     // }
    //     for (var i = 0; i < fileTypes.length; i++) {
    //         if (file.type === fileTypes[i]) {
    //             return true;
    //         }
    //     }

    //     console.log("Upload file type is not in image format!");
    //     return false;
    // }
    input = [];
    max = 5;
    accept = 'image/*';

    array = [];
    results = [];
    numberOfInput: number = 0;

    constructor(private sanitization: DomSanitizer) { }

    async fileChangeEvent(files) {
        this.numberOfInput = this.input.length;
        this.results = [];
        for (let file of files) {
            if (this.numberOfInput < this.max) {
                this.numberOfInput++;
                let result = await this.previewImage(file);
                result['url'] = this.sanitization.bypassSecurityTrustResourceUrl(result['url']);
                this.results.push(result);
            } else {
                console.log('Maximum files are uploaded!');
                break;
            }
        }
        return this.results;
    }
    previewImage(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.onload = function (e) {
                let img = {
                    name: file['name'],
                    file: file,
                    url: URL.createObjectURL(file),
                    // done: isPreLoad,
                    type: 'blob',
                    base64: reader.result
                };
                if (file['name'] && file['name'].split('.').length > 1) {
                    img['ext'] = file['name'].split('.').pop();
                }
                resolve(img);
            }
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    validatePhoto(file) {
        var fileTypes = [
            'image/jpeg',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]
        //let MB = 5;
        //var OVER_SIZE_MB = MB * 1000 * 1000;
        // if (file.size > OVER_SIZE_MB) {
        //     WsToastService.toastSubject.next({ content: "File size limit " + MB + "mb!" });
        //     return false;
        // }
        for (var i = 0; i < fileTypes.length; i++) {
            if (file.type === fileTypes[i]) {
                return true;
            }
        }

        console.log("Upload file type is not in image format!");
        return false;
    }
}
