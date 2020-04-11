import { Constants } from './../constants/constants';
import _ from 'lodash';

export class Currency {
  searchKeyword?: string;
  selectedCurrency: string;
  currencyFullName;
  displayedCurrencies;
  currencySymbols;

  public static currenciesAsArray = Object.keys(Constants.currencyFullname);
  public static nameAsArray = _.values(Constants.currencyFullname);
  public static symbols = Constants.currencySymbols;

  constructor() {
    this.currencyFullName = Constants.currencyFullname;
    this.displayedCurrencies = _.clone(Currency.currenciesAsArray);
    this.currencySymbols = Constants.currencySymbols;
  }
}