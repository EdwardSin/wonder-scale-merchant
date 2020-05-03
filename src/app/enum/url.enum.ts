export class URL {
    static AUTH_DEFAULT_SETTING_ADMIN_URL = '/api/auth-shops/default-setting-admins';
    static AUTH_SHOP_ADMIN_URL = '/api/auth-shops/shop-admins';
    static AUTH_ADVERTISING_CONTRIBUTOR_URL = '/api/auth-shops/advertising-contributors';
    static AUTH_CATEGORY_CONTRIBUTOR_URL = '/api/auth-shops/category-contributors';
    static AUTH_CART_CONTRIBUTOR_URL = '/api/auth-shops/cart-contributors';
    static AUTH_CARD_CONTRIBUTOR_URL = '/api/auth-shops/card-contributors';
    static AUTH_CREDIT_CONTRIBUTOR_URL = '/api/auth-shops/credit-contributors';
    static AUTH_RECEIPT_CONTRIBUTOR_URL = '/api/auth-shops/receipt-contributors';
    static AUTH_DEFAULT_SETTING_CONTRIBUTOR_URL = '/api/auth-shops/default-setting-contributors';
    static AUTH_IMAGE_CONTRIBUTOR_URL = '/api/auth-shops/image-contributors';
    static AUTH_ITEM_CONTRIBUTOR_URL = '/api/auth-shops/item-contributors';
    static Auth_FEATURE_CONTRIBUTOR_URL = '/api/auth-shops/feature-contributors';
    static AUTH_PROMOTION_CONTRIBUTOR_URL = '/api/auth-shops/promotion-contributors';
    static AUTH_RECRUITMENT_CONTRIBUTOR_URL = '/api/auth-shops/recruitment-contributors';
    static AUTH_QUOTATION_CONTRIBUTOR_URL = '/api/auth-shops/quotation-contributors';
    static AUTH_REVIEW_CONTRIBUTOR_URL = '/api/auth-shops/review-contributors';
    static AUTH_SHOP_CONTRIBUTOR_URL = '/api/auth-shops/shop-contributors';
    static AUTH_VOURCHER_CONTRIBUTOR_URL = '/api/auth-shops/voucher-contributors';
    static REVIEW_URL = '/api/reviews';
    static AUTH_SHOP_USER_URL = '/api/auth-users/shop-users';
    static AUTH_USERS_URL = '/api/auth-users';
    static FEATURE_URL = '/api/features';
}

export class FeatureUrl {
    static sendEmailUrl = URL.FEATURE_URL + '/send/email';
    static sendReportReviewUrl = URL.FEATURE_URL + '/send/report';
    static sendShopInvitationEmailUrl = URL.FEATURE_URL + 'send/invitation';
    static sendInformationUrl = URL.FEATURE_URL + 'send/information';
}
export class AuthUserUrl {
    static getUserUrl = URL.AUTH_USERS_URL + '/users';
    static getPasswordExistedUrl = URL.AUTH_USERS_URL + '/users/is-password';
    static editProfileUrl = URL.AUTH_USERS_URL + '/users/edit/profile';
    static editGeneralUrl = URL.AUTH_USERS_URL + '/users/edit/general';
    static changePasswordUrl = URL.AUTH_USERS_URL + '/users/edit/password';
    static savePasswordUrl = URL.AUTH_USERS_URL + '/users/save/password';
}
export class AuthShopUserUrl {
    static isAuthenticatedShopByShopUsernameUrl = URL.AUTH_SHOP_USER_URL + '/is-authenticated';
    static getShopsByUserIdUrl = URL.AUTH_SHOP_USER_URL + '/contributor';
    static getAuthenticatedShopByShopUsernameUrl = URL.AUTH_SHOP_USER_URL + '/authenticated';
    static getNotActiveShopsByUserIdUrl = URL.AUTH_SHOP_USER_URL + '/contributor/not-active';
    static getInvitationShopsByUserIdUrl = URL.AUTH_SHOP_USER_URL + '/contributor/pending';
    static addShopUrl = URL.AUTH_SHOP_USER_URL + '/add';
}
export class AuthVoucherContributorUrl {
    static getClaimedVouchersUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/claimed-vouchers';
    static getClaimedVouchersInDetailsUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/claimed-vouchers-in-details';
    static getUsedVouchersUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/used-vouchers';
    static getUsedVouchersInDetailsUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/used-vouchers-in-details';
    static publishPromotionUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/publish';
}
export class AuthShopContributorUrl {
    static getContributorsUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/contributors';
    static addBannerUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/add/banner-image';
    static editProfileUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/edit/profile-image';
    static editGeneralUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/edit/general';
    static editContactUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/edit/contact';
    static editBannerUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/edit/banner-image';
    static removeBannerUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/remove/banner-image';
    static addMediaUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/media';
    static removeMediaUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/media/remove';
    static editMediaUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/media';
    static joinContributorUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/contributor/join';
    static rejectContributorUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/contributor/reject';
    static leaveShopUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/leave';
    static editInformationImagesUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/edit/information-image';
    static editInformationImagesOrderUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/rearrange/information-image';
    static removeInformationImageUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/remove/information-image';
    static advertiseItemsUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/advupdate';
    static updateNewItemMessageUrl = URL.AUTH_SHOP_CONTRIBUTOR_URL + '/updatemessage';
}
export class AuthReviewContributorUrl {
    static getReviewByShopIdUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/shopid';
    static addReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/shop-reply';
    static editReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/shop-reply/edit';
    static removeReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/shop-reply/remove';
    static getRepliesByReviewIdUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/replies';
}
export class AuthQuotationContributorUrl {
    static getUnrepliedRequestsUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/unreplied';
    static getHistoryRequestsUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/history';
    static getRejectRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/reject';
    static replyQuotationRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/request/reply';
    static inactivateRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/request/inactivate';


    static getQuotationUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template/create';
    static createQuotationTemplate = URL.AUTH_QUOTATION_CONTRIBUTOR_URL;
    static getQuotationTemplateUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template';
    static editQuotationTemplateUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template';
    static getQuotationTemplatesUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/templates';
    static getQuotationsByRequestIdUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/requestid';

}
export class AuthRecruitmentContributorUrl {
    static createRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/add';
    static editRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL;
    static getRecruitmentByIdUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL;
    static getRecruitmentsUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/shopid';
    static extendRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/extend';
    static postRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/post';
}
export class AuthPromotionContributorUrl {
    static uploadPromotionImageUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/upload';
    static createPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
    static editPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
    static getPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
    static getPromotionsByShopIdUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/shopid';
}
export class AuthImageContributorUrl {
    static uploadProfileImagesToItemUrl = URL.AUTH_IMAGE_CONTRIBUTOR_URL + '/upload/profileimage';
    static uploadDescriptionImagesToItemUrl = URL.AUTH_IMAGE_CONTRIBUTOR_URL + '/upload/descriptionimage';
}
export class AuthItemContributorUrl {
    static markAsNewUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/markasnew/items';
    static unmarkNewUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unmarknew/items';
    static getItemById = URL.AUTH_ITEM_CONTRIBUTOR_URL + '';
    static getItemsByCategoryIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/items-by-categoryid';
    static getAuthenticatedAllItemsByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/all';
    static getAuthenticatedNewItemsByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/new';
    static getAuthenticatedDiscountItemsByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/discount';
    static getAuthenticatedPublishedItemCategoryByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/published';
    static getAuthenticatedUnpublishedItemCategoryByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unpublished';
    static getAuthenticatedUncategorizedItemCategoryByShopIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/uncategorized';
    static activateItemsUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/publish/items';
    static inactivateItemsUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unpublish/items';
    static addItemUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '';
    static editItemUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '';
    static editItemTypesUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/item-types';
    static editMultipleItemsUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/edit-multiple';
    static removeItemsPermanantlyUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/remove/items/permanently';
    static removeItemTypeUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/remove/item-type';
    static uploadItemsUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/upload/items'
    static editProfileImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/edit/profile-image';
    static editDescriptionImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/edit/description-image';
    static editItemTypeImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/edit/item-type-image';
    static editProfileImageIndexUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/edit/profile-image-index';
    static removeProfileImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/remove/profile-image';
    static removeDescriptionImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/remove/description-image';
    static removeItemTypeImageUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/remove/item-type-image';

}
export class AuthCartContributorUrl {
    static checkOutUrl = URL.AUTH_CART_CONTRIBUTOR_URL + '/checkout';
    static precheckoutUrl = URL.AUTH_CART_CONTRIBUTOR_URL + '/precheckout';
}
export class AuthCardContributorUrl {
    static getCardsByShopIdUrl = URL.AUTH_CARD_CONTRIBUTOR_URL;
    static getCardByIdUrl = URL.AUTH_CARD_CONTRIBUTOR_URL;
    static addCardUrl = URL.AUTH_CARD_CONTRIBUTOR_URL;
    static editCardUrl = URL.AUTH_CARD_CONTRIBUTOR_URL;
    static setDefaultUrl = URL.AUTH_CARD_CONTRIBUTOR_URL + '/default';
    static deleteCardUrl = URL.AUTH_CARD_CONTRIBUTOR_URL;
}
export class AuthCreditContributorURL {
    static getCreditUrl = URL.AUTH_CREDIT_CONTRIBUTOR_URL;
    static startAdvertisingUrl = URL.AUTH_CREDIT_CONTRIBUTOR_URL + '/start-advertising';
}
export class AuthReceiptContributorUrl {
    static getAllReceiptsByShopIdUrl = URL.AUTH_RECEIPT_CONTRIBUTOR_URL;
}
export class AuthDefaultSettingContributorUrl {
    static getDefaultItemSettingByShopIdUrl = URL.AUTH_DEFAULT_SETTING_CONTRIBUTOR_URL + '/item'
}
export class AuthFeatureContributorUrl {
    static purchaseRecruitmentUrl = URL.Auth_FEATURE_CONTRIBUTOR_URL + '/purchase/recruitment';
}

export class AuthCategoryContributorUrl {
    static getCategoryByNameAndShopIdUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/name';
    static addCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static editCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static removeCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static removeCategoriesUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/remove/categories';
    static getAuthenticatedCategoriesByShopIdUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/shopid';
    static addItemsToCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/items/add';
    static removeItemsFromCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/remove/itemsfromcategory';
    static moveCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/move';
    static rearrangeCategoriesUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/rearrange';
    static getNumberOfAllItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_all_items';
    static getNumberOfNewItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_new_items';
    static getNumberOfDiscountItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_discount_items';
    static getNumberOfPublishedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_published_items';
    static getNumberOfUnpublishedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_unpublished_items';
    static getNumberOfUncategorizedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_uncategorized_items';

}

export class AuthAdvertisingContributorUrl {
    static getAdvertisingRecordUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/advertisingrecord';
    static checkoutUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/checkout';
    static checkoutFreeUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/checkoutfree';
    static extendUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/extend';
    static updateExpireAdvertisingUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/updateexpireadvertising';
    static getFreeSlotsUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/getfreeslots';
}
export class AuthShopAdminUrl {
    static searchContributorUrl = URL.AUTH_SHOP_ADMIN_URL + '/search?query=';
    static inviteContributorUrl = URL.AUTH_SHOP_ADMIN_URL + '/contributor/invite';
    static editContributorUrl = URL.AUTH_SHOP_ADMIN_URL + '/contributor/edit';
    static removeContributorUrl = URL.AUTH_SHOP_ADMIN_URL + '/contributor/remove';
    static closePermanentlyUrl = URL.AUTH_SHOP_ADMIN_URL + '/close/permanently';
    static reactivateShopUrl = URL.AUTH_SHOP_ADMIN_URL + '/reactivate';
}

export class AuthDefaultSettingAdminUrl {
    static getDefaultSettingByShopIdUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL;
    static setDefaultSettingByShopIdUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL + '/edit';
}