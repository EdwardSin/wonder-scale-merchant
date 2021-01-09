import { environment } from '@environments/environment';
declare var $: any;
// @dynamic
export class ImageHelper {

  constructor() { }

  public static getRemoveProfileImageIndex(listLength, removeIndex, profileImageIndex) {
    let index = 0;
    if (listLength - 1 >= profileImageIndex && removeIndex <= profileImageIndex && profileImageIndex != 0) {
      index = profileImageIndex - 1;
    } else {
      index = profileImageIndex;
    }
    return index;
  }

  public static getProfileImageIfEmpty(allProfileImages, profileImageIndex, defaultImage = "img_not_available.png") {
    return allProfileImages.length == 1 ? defaultImage : allProfileImages[profileImageIndex];
  }

  public static getFormattedImage(filename, foldername = 'item_thumbnails') {
    if (filename) {
      return filename.substring(filename.indexOf(foldername)).split(".").shift();
    }
    return filename;
  }

  public static getUploadProfileItem(uploadProfileItems, filename) {
    return uploadProfileItems.find(file => { return file.name == filename })
  }

  public static magnify(img) {
    $.magnificPopup.open({
      type: "image",
      closeOnContentClick: true,
      closeBtnInside: false,
      midClick: true,
      fixedContentPos: true,
      items: {
        src: environment.IMAGE_URL + img
      },
      image: {
        verticalFit: true
      },
      removalDelay: 500,
      callbacks: {
        beforeOpen: function () {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace(
            "mfp-figure",
            "mfp-figure mfp-with-anim"
          );
          this.st.mainClass = "mfp-zoom-in";
        }
      }
    });
  }
  public static async resizeImage(src, width, height, quality=1) {
    return new Promise((resolve, reject) => {
      let img = new Image;
      img.onload = () => resolve(this._resizeImage(img, width || img.width, height || img.height, quality));
      img.onerror = reject;
      img.src = src;
    });
  }
  private static _resizeImage(img, targetWidth, targetHeight, quality) {
    return this.imageToDataUri(img, targetWidth, targetHeight, quality);
  }
  private static imageToDataUri(img, width, height, quality) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL('image/jpeg', quality);
}
}
