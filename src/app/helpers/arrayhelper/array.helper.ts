
import * as _ from 'lodash';

export class ArrayHelper {

    constructor() { }

    //Tested
    public static clear(array: Array<any>) {
        array.length = 0;
    }
    //Tested
    public static setArray(array: Array<any>, newArray: Array<any>) {
        array.length = 0;
        Array.prototype.push.apply(array, newArray);
    }
    //Tested
    public static pushArray(array: Array<any>, ...newArray: Array<any>) {
        Array.prototype.push.apply(array, ...newArray);
        return array;
        //return _.concat(array, ...newArray);
    }
}
