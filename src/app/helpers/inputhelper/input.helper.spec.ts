import { TestBed, inject } from '@angular/core/testing';

import { InputHelper } from './input.helper';

describe('InputHelper', () => {
  beforeEach(() => {
     TestBed.configureTestingModule({
     });
  });

  it('should make price more than 0', () => {
    let event = {
      target: {
        value: -100
      }
    }
    let discount = InputHelper.getValidPrice(event);
    let expected = '0.00';
    expect(expected).toEqual(discount);
  })
  it('should make price less than 10000000', () => {
    let event = {
      target: {
        value: 10000001
      }
    }
    let discount = InputHelper.getValidPrice(event);
    let expected = '10,000,000.00';
    expect(expected).toEqual(discount);
  })
  it('should make price between 0 - 10000000', () => {
    let event = {
      target: {
        value: 10000
      }
    }
    let discount = InputHelper.getValidPrice(event);
    let expected = '10,000.00';
    expect(expected).toEqual(discount);
  })


  it('should make discount more than 0', () => {
    let event = {
      target: {
        value: -1
      }
    }
    let discount = InputHelper.getValidDiscount(event);
    let expected = '0.00';
    expect(expected).toEqual(discount);
  })
  it('should make discount less than 100', () => {
    let event = {
      target: {
        value: 101
      }
    }
    let discount = InputHelper.getValidDiscount(event);
    let expected = '100.00';
    expect(expected).toEqual(discount);
  })
  it('should make discount between 0 - 100', () => {
    let event = {
      target: {
        value: 100
      }
    }
    let discount = InputHelper.getValidDiscount(event);
    let expected = '100.00';
    expect(expected).toEqual(discount);
  })

});
