import { Item } from "./item";

export class OnSellingItem {
    _id?: string;
    item?: string | Item;
    categories: Array<string>;
    store: string;
    isTypeShown: boolean;
    subItemGroups: Array<SubItemGroup>;
    quantity?: number = 1;
    isEntityNew?: boolean = false;
}
class SubItemGroup {
    name: string;
    isMultiSelect: boolean;
    maxSubItem: number;
    minSubItem: number;
    isOnePerSubItem: boolean;
    subItems: Array<SubItem>;
    isSelected?: boolean;
}

class SubItem {
    _id: string;
    name: string;
    quantity?: number = 0;
    price: number;
}