// @dynamic
export class PriceHelper {

  public static currencies;
  public static currencySymbols;
  public static targetCurrency;
  public static symbol;
  public static rate;

  public static getDisplayPrice(items: Array<any>, currencies, rate: number) {
    for (let item of items) {
      if (item['isOffer']) {
        item.discount_price = this.priceAfterDiscount(item['price'], item['discount']);
      }
      item.display_price = +(this.getDisplayCurrencyPrice(item.price, currencies[item.currency], rate).toFixed(2));
      item.display_discount_price = item.display_price - (+(this.getDisplayCurrencyPrice(this.displayPriceAfterDiscount(item.price, item.discount), currencies[item.currency], rate).toFixed(2)));
    }
  }
  private static getDisplayCurrencyPrice(price, currency, rate): number{
    return (price / currency) * rate;
  }
  private static priceAfterDiscount(price, discount = 0): number {
    return price - ((100 - discount) / 100) * price;
  }
  private static displayPriceAfterDiscount(price, discount = 0){
    return this.priceAfterDiscount(price, discount);
  }
}
