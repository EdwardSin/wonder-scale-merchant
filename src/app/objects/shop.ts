import { OpeningInfoType } from "../types/opening-info.type";
import { OpeningInfo } from "./opening-info";

export class Shop {
    _id?: string;
    contributorEmail?: Array<string>;
    name: string;
    username?: string;
    serviceType: string;
    profileImage?: string = "upload/images/shop.png";
    fullAddress?: {
        address: string,
        state: string,
        postcode: string,
        city: string,
        country: string,
    };
    phone?: Array<string>;
    website?: Array<string>;
    location?: {
        type?: String,
        coordinates: [number, number]
    };
    status?: {
        status: StatusType,
        expireDate?: Date
    };
    type?: string;
    email?: Array<string>;
    tags?: Array<string>;
    description?: string;
    openingInfoType?: OpeningInfoType;
    openingInfo?: Array<OpeningInfo>;
    media?: Array<string>;
    currentStatus?: boolean;
    review?: {
        count: number,
        score: number
    };
    viewed?: number;
    categoryList?: Array<string>;
}
type StatusType = 'pending' | 'active' | 'inactive' | 'blocked' | 'saved' | 'unsaved' | 'save removed';