import { TestBed, inject } from '@angular/core/testing';

import { StatusHelper } from './status.helper';

describe('StatusHelper', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('will validate time between 2 times', () => {
        let date = new Date();
        let currentDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 59, 0, 0);
        let openingTime = '10:00 am';
        let closingTime = '02:00 pm';
        var result = StatusHelper.isBetweenTime(currentDateTime, openingTime, closingTime);
        expect(result).toBeTruthy();
    });
    it('will validate time latter 2 times', () => {
        let date = new Date();
        let currentDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0, 0, 0);
        let openingTime = '10:00 am';
        let closingTime = '02:00 pm';
        var result = StatusHelper.isBetweenTime(currentDateTime, openingTime, closingTime);
        expect(result).toBeFalsy();
    });
    it('will validate time earlier 2 times', () => {
        let date = new Date();
        let currentDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0, 0, 0);
        let openingTime = '10:00 am';
        let closingTime = '02:00 pm';
        var result = StatusHelper.isBetweenTime(currentDateTime, openingTime, closingTime);
        expect(result).toBeTruthy();
    });
});
