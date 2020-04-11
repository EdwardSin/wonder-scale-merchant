
import { TestBed } from '@angular/core/testing';
import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
  });

  it('will clear array as same reference object', () => {
    var array = [1, 2, 3, 4, 5];
    ArrayHelper.clear(array);
    expect(array.length).toEqual(0);
  })

  it('will using same reference object', () => {
    var array = [1, 2, 3, 4, 5];
    var array1 = array;
    ArrayHelper.setArray(array, [1, 2, 3, 4, 5]);
    expect(array1).toBe(array);
  })

  it('will combine 2 arrays', () => {
    let array1 = [1, 2, 3, 4, 5];
    let array2 = [1, 2, 3, 4, 5];
    let expected = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    let result = ArrayHelper.pushArray(array1, array2);
    expect(expected).toEqual(result);
  })

});
