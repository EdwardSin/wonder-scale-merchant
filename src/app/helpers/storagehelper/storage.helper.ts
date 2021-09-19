export class SessionStorageHelper {
    public static setItem(key, value) {
        if (typeof (sessionStorage) !== 'undefined') {

        }
    }
    public static getItem(key) {
        if (typeof (sessionStorage) !== 'undefined') {
            
        }
    }
}

export class LocalStorageHelper {

    public static setItem(key, value) {
        if (typeof (localStorage) !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    public static getItem(key) {
        if (typeof (localStorage) !== 'undefined') {
            let obj = localStorage.getItem(key);
            if (this.isJSON(obj)) {
                return JSON.parse(obj);
            }
            return {};
        }
    }
    public static setItemObj(key, value) {
        if (typeof (localStorage) !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    public static getItemObj(key) {
        if (typeof (localStorage) !== 'undefined') {
            let obj = localStorage.getItem(key);
            if (obj && this.isJSON(obj)) {
                return JSON.parse(obj);
            }
            return {};
        }
    }
    public static removeItem(key) {
        if (typeof (localStorage) !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
    private static isJSON(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }
}