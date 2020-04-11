import { TestBed, inject } from '@angular/core/testing';

import { InputValidateHelper } from './inputvalidate.helper';

describe('InputValidateHelper', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('is undefined', () => {
        var obj = undefined;
        var result = InputValidateHelper.isEmptyAndUndefinedAndNull(obj);
        expect(result).toBeTruthy();
    });
    it('is null', () => {
        var obj = null;
        var result = InputValidateHelper.isEmptyAndUndefinedAndNull(obj);
        expect(result).toBeTruthy();
    })
    it('is empty string', () => {
        var obj = "";
        var result = InputValidateHelper.isEmptyAndUndefinedAndNull(obj);
        expect(result).toBeTruthy();
    })

    it('is empty string', () => {
        var obj = "";
        var result = InputValidateHelper.isEmptyAndUndefinedAndNull(obj);
        expect(result).toBeTruthy();
    })
    // it('is empty string', () => {
    //     var hour = "";
    //     var result = InputValidateHelper.setDefaultDateIfInvalid(hour);
    //     expect(result).toBeTruthy();
    // })

    it('is valid hour', () => {
        var hour = "";
        var result : boolean;

        hour = "09:00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeTruthy();

        hour = "09:00 Am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeTruthy();

        hour = "9:00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "99:00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "09:00 em";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "09:60 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "09:60 ama";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "0a:00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "00:a0 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "00:00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();

        hour = "09-00 am";
        result = InputValidateHelper.validatedHour(hour);
        expect(result).toBeFalsy();
    });

    it('get formatted hour, make sure AMPM is lowercase', () => {
        var hour = "09:00 am";
        var result = InputValidateHelper.getFormattedHour(hour);
        expect(result).toEqual("09:00 am");
    })

    it('get defaultdate if provided date is invalid', () => {
        var hour = "11111 am";
        var defaultValue = "09:00 am"
        var result = InputValidateHelper.setDefaultDateIfInvalid(hour, defaultValue);
        expect(result).toEqual(defaultValue);

        hour = "08:00 am";
        result = InputValidateHelper.setDefaultDateIfInvalid(hour, defaultValue);
        expect(result).toEqual("08:00 am");
    })

    it('will validate and correct selectedHours', ()=> {
        var operatingHour = [{ time: [ { openingHour: "12:00 am" , closeHour: "11:00 pm"}], selected: true },
        { time: [ { openingHour: "12:00am" , closeHour: "11:00 pm"}], selected: true },
        { time: [ { openingHour: "12:00 am" , closeHour: "11:0 pm"}], selected: true }];
        var booleanResult = InputValidateHelper.validateAndCorrectSelectedHours(operatingHour);
        var result = [{ time: [ { openingHour: "12:00 am" , closeHour: "11:00 pm"}], selected: true },
                      { time: [ { openingHour: "09:00 am" , closeHour: "11:00 pm"}], selected: true },
                      { time: [ { openingHour: "12:00 am" , closeHour: "05:00 pm"}], selected: true }]
        expect(booleanResult).toBeFalsy();
        expect(operatingHour).toEqual(result);
    })
});
