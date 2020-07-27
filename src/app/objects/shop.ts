import { OpeningInfoType } from "../types/opening-info.type";
import { OpeningInfo } from "./opening-info";

export class Shop {
    _id?: string;
    contributorEmail?: Array<string>;
    name: string;
    username?: string;
    serviceType: string;
    profileImage?: string = "upload/images/shop.png";
    bannerImage?: string;
    informationImages?: Array<string>;
    menuImages?: Array<string>;
    showAddress: boolean;
    fullAddress?: {
        address: string,
        state: string,
        postcode: string,
        country: string,
    };
    phone?: Array<string>;
    website?: Array<string>;
    location?: {
        type?: string,
        coordinates: [number, number]
    };
    isPublished: boolean;
    status?: {
        status: StatusType,
        expiryDate?: Date
    };
    type?: string;
    email?: Array<string>;
    tags?: Array<string>;
    description?: string;
    openingInfoType?: OpeningInfoType;
    openingInfo?: Array<OpeningInfo>;
    media?: Array<any>;
    currency?: string;
    currentStatus?: boolean;
    review?: {
        count: number,
        score: number
    };
    viewed?: number;
    contributors: [];
    categoryList?: Array<string>;
    trackExpiration: string;
    number_of_all_items: number;
    selectedPackage: string;
     constructor(){
         this.location = {
             type: 'Point',
             coordinates: [0, 0]
         }
     }
}
type StatusType = 'pending' | 'active' | 'inactive' | 'blocked' | 'closed' | 'saved' | 'unsaved' | 'save removed';