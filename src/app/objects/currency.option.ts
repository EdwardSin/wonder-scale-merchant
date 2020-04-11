import { Constants } from './../constants/constants';
export class CurrencyOption{
    currencySymbols = Constants.currencySymbols;
    currencies: Object;
    target_currency: string = 'MYR';
    symbol: string;
    rate: number;
}