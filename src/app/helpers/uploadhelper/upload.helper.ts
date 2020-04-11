import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
export class UploadHelper {

    public static fileChangeEvent(fileInput: any) {
        return <Array<File>>fileInput.target.files;
    }

    public static readURL(file, imgTarget, callback?: Function) {
        if (file && this.validatePhoto(file)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var image = imgTarget;
                image["src"] = e["target"]["result"];
                image.onload = function(){
                    if(callback){
                        callback();}
                }
            };
            reader.readAsDataURL(file);
        }
    }
    public static showImages(array = [], imageFiles, callback, isPreLoad = false) {
        var reader;
        var images = array;
        for (let image of imageFiles) {
            if (image && this.validatePhoto(image)) {
                reader = new FileReader();
                reader.onload = function (e) {
                        var img = {
                            name: image['name'],
                            file: image,
                            done: isPreLoad,
                            type: 'blob',
                            base64: e['target']['result']
                        };
                        if(image['name'] && image['name'].split('.').length > 1){
                            img['ext'] = image['name'].split('.').pop();
                        }
                        images.push(img);
                        callback(img);
                    
                }
                reader.readAsDataURL(image);
            }
        }
        return images;
    }
    public static notificationIfOver(ableToUploadProfileFiles, preProfileFiles) {
        if (ableToUploadProfileFiles.length == 0 || preProfileFiles.length > ableToUploadProfileFiles.length) {
            WsToastService.toastSubject.next({ content: "Max images are uploaded!" });
        }
    }
    public static getMaxAbleUploadProfileFiles(exist_profile_items_number, preprofile_files, MAX = 1) {
        var able_upload_spaces = MAX - exist_profile_items_number;
        var able_upload_profile_files = [];
        for (let i = 0; i < able_upload_spaces; i++) {
            if (preprofile_files[i]) {
                able_upload_profile_files.push(preprofile_files[i]);
            }
            else {
                
                break;
            }
        }
        return able_upload_profile_files;
    }
    private static validatePhoto(file) {
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
