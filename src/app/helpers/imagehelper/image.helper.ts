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
}
