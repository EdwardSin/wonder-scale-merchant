import { TestBed, inject } from '@angular/core/testing';

import { OrderHelper } from './order.helper';

describe('OrderHelper', () => {
  beforeEach(() => {
     TestBed.configureTestingModule({
     });
  });

  it('should ordered store by thebest', () => {
    // var storeList = [{dist: {calculated: 1}}, {dist: {calculated: 3}},{dist: {calculated: 2}},{dist: {calculated: 4}}];
    // var result = [{dist: {calculated: 1}},{dist: {calculated: 2}},{dist: {calculated: 3}},{dist: {calculated: 4}}];
    var storeList = [{dist: 1}, {dist: 3},{dist: 2},{dist: 4}];
    var result = [{dist: 1},{dist: 2},{dist: 3},{dist: 4}];
    var orderedStoreList = OrderHelper.orderByAndSetStoreList('thebest', storeList);
    expect(orderedStoreList).toEqual(result);
  });

  it('should ordered store by alphabet', () => {
    var storeList = [{name: 'ab'}, {name: 'bc'}, {name: 'ca'}, {name: 'ac'}];
    var result = [{name: 'ab'}, {name: 'ac'}, {name: 'bc'}, {name: 'ca'}];
    var orderedStoreList = OrderHelper.orderByAndSetStoreList('alphabet', storeList);
    expect(orderedStoreList).toEqual(result);
  });

  it('should ordered store by distance', () => {
    var storeList = [{dist: 1}, {dist: 3},{dist: 2},{dist: 4}];
    var result = [{dist: 1},{dist: 2},{dist: 3},{dist: 4}];
    var orderedStoreList = OrderHelper.orderByAndSetStoreList('distance', storeList);
    expect(orderedStoreList).toEqual(result);
  });
  it('should ordered store by popularity', () => {
    var storeList = [{ review: { score: 1 } }, { review: { score: 3 } }, { review: { score: 2 } }, { review: { score: 4 } }];
    var result = [{ review: { score: 1 } }, { review: { score: 2 } }, { review: { score: 3 } }, { review: { score: 4 } }];
    var orderedStoreList = OrderHelper.orderByAndSetStoreList('popularity', storeList);
    expect(orderedStoreList).toEqual(result);
  });

  it('should ordered item by thebest', () => {
    var itemList = [{discountPrice: 10, index: 2, seller:{dist: 1}}, 
                    {discountPrice: 20, index: 2, seller:{dist: 2}}, 
                    {discountPrice: 10, index: 2, seller:{dist: 3}}, 
                    {discountPrice: 20, index: 2, seller:{dist: 4}}];
    var result = [{discountPrice: 10, index: 2, seller:{dist: 1}}, 
                    {discountPrice: 10, index: 2, seller:{dist: 3}}, 
                    {discountPrice: 20, index: 2, seller:{dist: 2}}, 
                    {discountPrice: 20, index: 2, seller:{dist: 4}}];
    var orderedItemList = OrderHelper.orderByAndSetItemList('thebest', itemList);
    expect(orderedItemList).toEqual(result);
  });
  it('should ordered item by price from low to high', () => {
    var itemList = [{displayPrice: 40, index: 2}, 
                    {displayPrice: 20, index: 2}, 
                    {displayPrice: 30, index: 2}, 
                    {displayPrice: 20, index: 2}];
    var result =   [{displayPrice: 20, index: 2}, 
                    {displayPrice: 20, index: 2}, 
                    {displayPrice: 30, index: 2}, 
                    {displayPrice: 40, index: 2}];
    var orderedItemList = OrderHelper.orderByAndSetItemList('price_low_to_high', itemList);
    expect(orderedItemList).toEqual(result);
  });

  it('should ordered item by price from high to low', () => {
    var itemList = [{displayPrice: 40, index: 2}, 
                    {displayPrice: 20, index: 2}, 
                    {displayPrice: 30, index: 2}, 
                    {displayPrice: 20, index: 2}];
    var result =   [{displayPrice: 40, index: 2}, 
                    {displayPrice: 30, index: 2}, 
                    {displayPrice: 20, index: 2}, 
                    {displayPrice: 20, index: 2}];
    var orderedItemList = OrderHelper.orderByAndSetItemList('price_high_to_low', itemList);
    expect(orderedItemList).toEqual(result);
  });

  it('should ordered item by alphabet', () => {
    var itemList = [{name: 'ab'}, 
                    {name: 'bc'}, 
                    {name: 'cd'}, 
                    {name: 'ad'}];
    var result = [{name: 'ab'}, {name: 'ad'}, {name: 'bc'}, {name: 'cd'}];
    var orderedItemList = OrderHelper.orderByAndSetItemList('alphabet', itemList);
    expect(orderedItemList).toEqual(result);
  });
  it('should ordered item by distance', () => {
    var itemList = [{seller:{dist: 4}}, 
                    {seller:{dist: 3}}, 
                    {seller:{dist: 1}}, 
                    {seller:{dist: 2}}];
    var result =   [{seller:{dist: 1}}, 
                    {seller:{dist: 2}}, 
                    {seller:{dist: 3}}, 
                    {seller:{dist: 4}}];
    var orderedItemList = OrderHelper.orderByAndSetItemList('distance', itemList);
    expect(orderedItemList).toEqual(result);
  });
  // it('should ordered item by popularity', () => {
  //   var itemList = [{seller:{review: {score: 1}}}, 
  //           {seller:{review: {score: 3}}},
  //           {seller:{review: {score: 2}}},
  //           {seller:{review: {score: 4}}}];
  //   var result = [{seller:{review: {score: 1}}},
  //           {seller:{review: {score: 2}}},
  //           {seller:{review: {score: 3}}},
  //           {seller:{review: {score: 4}}}];
  //   var orderedItemList = OrderHelper.orderByAndSetItemList('popularity', itemList);
  //   expect(orderedItemList).toEqual(result);
  // });
});