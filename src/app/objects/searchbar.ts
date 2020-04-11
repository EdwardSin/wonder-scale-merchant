import { OrderingType } from '@wstypes/ordering.type';
import { OrderType } from '@wstypes/order.type';
import { ViewType } from '@wstypes/view.type';

export class Searchbar {
    searchKeyword: string = "";
    order: OrderType;
    orderBy: OrderingType;
    display: ViewType;
}