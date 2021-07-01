import * as _ from "lodash";
import { OrderingType } from '@wstypes/ordering.type';
import { OrderType } from '@wstypes/order.type';

export class OrderHelper {
    constructor() { }
    // Tested
    public static orderByAndSetStoreList(orderMethod: OrderType, storeList: Array<any>) {
        let list;
        switch (orderMethod) {
            case "thebest":
                list = _.sortBy(storeList, x => {
                    if (x.review) { return [x["dist"], x.review.score] }
                    return x["dist"]
                });
                break;
            case "related":
                list = storeList;
                break;
            case "alphabet":
                list = _.sortBy(storeList, x => x["name"].toLowerCase());
                break;
            case "distance":
                list = _.sortBy(storeList, x => x["dist"]);
                break;
            case "popularity":
                list = _.sortBy(storeList, x => { if (x['review']) { return x["review"].score } return 0; });
                break;
            default:
                list = storeList;
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
