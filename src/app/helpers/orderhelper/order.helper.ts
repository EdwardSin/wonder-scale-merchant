import * as _ from "lodash";
import { OrderingType } from '@wstypes/ordering.type';
import { OrderType } from '@wstypes/order.type';

export class OrderHelper {
    constructor() { }
    // Tested
    public static orderByAndSetShopList(orderMethod: OrderType, shopList: Array<any>) {
        let list;
        switch (orderMethod) {
            case "thebest":
                list = _.sortBy(shopList, x => {
                    if (x.review) { return [x["dist"], x.review.score] }
                    return x["dist"]
                });
                break;
            case "related":
                list = shopList;
                break;
            case "alphabet":
                list = _.sortBy(shopList, x => x["name"].toLowerCase());
                break;
            case "distance":
                list = _.sortBy(shopList, x => x["dist"]);
                break;
            case "popularity":
                list = _.sortBy(shopList, x => { if (x['review']) { return x["review"].score } return 0; });
                break;
            default:
                list = shopList;
        }
        return list;
    }
    // Tested
    public static orderByAndSetItemList(orderMethod: OrderType, itemList: Array<any>, orderBy: OrderingType = 'asc') {
        let list;
        switch (orderMethod) {
            case "thebest":
                list = _.sortBy(itemList, ['discountPrice', '-item.index', 'seller.dist']);
                break;
            case "related":
                list = itemList;
                break;
            case "price_low_to_high":
                list = _.sortBy(itemList, ["display_discount_price"]);
                break;
            case "price_high_to_low":
                list = _.sortBy(itemList, ["display_discount_price"]).reverse();
                break;
            case "alphabet":
                list = _.sortBy(itemList, x => x["name"].toLowerCase());
                break;
            case "distance":
                list = _.sortBy(itemList, x => x["seller"].dist);
                break;
            case 'latest':
                list = _.sortBy(itemList, x => x['updated_at']);
                break;
            case 'status':
                list = _.sortBy(itemList, ['status', 'name']);
                break;
            case "popularity":
                list = _.sortBy(itemList, x => { return x['seller'] && x["seller"]["review"] ? x["seller"].review.score : 0;});
                break;
            default:
                list = itemList;
        }
        return orderBy === 'asc' ? list : list.reverse();
    }
}
