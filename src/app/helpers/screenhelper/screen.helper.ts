const maxMobileSize = 992;

export class ScreenHelper {
  constructor() { }

  // Tested
  public static isMobileSize(){
      return window.innerWidth < maxMobileSize;
  }
}
