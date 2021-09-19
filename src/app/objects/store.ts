import { OpeningInfoType } from "../types/opening-info.type";
import { Delivery } from "./delivery";
import { FAQ } from "./faq";
import { OpeningInfo } from "./opening-info";

export class Store {
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
    deliveries?: Array<Delivery>;
    location?: {
        type?: string,
        coordinates: [number, number]
    };
    isPublished: boolean;
    isOrderingOn?: boolean;
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
    numberOfAllItems: number;
    numberOfPublishedItems: number;
    bankDetails?: {
        bankName: string,
        accountName: string,
        accountNo: string
    }
    defaultSetting?: {
        invoice?: {
            isPublicReceivable?: boolean,
            isApprovalEnabled?: boolean
        }
    }
    faq?: Array<FAQ>;
    contactButton?: {
        label: string,
        type: string,
        value: string
    };
     constructor(){
         this.location = {
             type: 'Point',
             coordinates: [0, 0]
         }
     }
}
type StatusType = 'pending' | 'active' | 'inactive' | 'blocked' | 'closed' | 'saved' | 'unsaved' | 'save removed';