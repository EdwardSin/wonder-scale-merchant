export class URL {
    static USER_URL = '/api/users';
    static CATEGORY_URL = '/api/categories';
    static TRACK_URL = '/api/tracks';
    static STORE_URL = '/api/stores';
    static INVOICE_URL = '/api/invoices';
    static ITEM_URL = '/api/items';
    static AUTH_INVOICE_URL = '/api/auth-users/invoice-users';
    static AUTH_DEFAULT_SETTING_ADMIN_URL = '/api/auth-stores/default-setting-admins';
    static AUTH_PACKAGE_ADMIN_URL = '/api/auth-stores/package-admins';
    static AUTH_STORE_ADMIN_URL = '/api/auth-stores/store-admins';
    static AUTH_PAYMENT_METHOD_ADMIN_URL = '/api/auth-stores/payment-method-admins';
    static AUTH_STATEMENT_CONTRIBUTOR_URL = '/api/auth-stores/statement-admins';
    static AUTH_CATEGORY_CONTRIBUTOR_URL = '/api/auth-stores/category-contributors';
    static AUTH_CARD_CONTRIBUTOR_URL = '/api/auth-stores/card-contributors';
    static AUTH_DEFAULT_SETTING_CONTRIBUTOR_URL = '/api/auth-stores/default-setting-contributors';
    static AUTH_INVOICE_CONTRIBUTOR_URL = '/api/auth-stores/invoice-contributors';
    static AUTH_INVOICE_CONFIGURATION_CONTRIBUTOR_URL = '/api/auth-stores/invoice-configuration-contributors';
    static AUTH_CUSTOMER_CONTRIBUTOR_URL = '/api/auth-stores/customer-contributors';
    static AUTH_PROMOTION_CONTRIBUTOR_URL = '/api/auth-stores/promotion-contributors';
    static AUTH_DELIVERY_CONTRIBUTOR_URL = '/api/auth-stores/delivery-contributors';
    static AUTH_ANALYSIS_CONTRIBUTOR_URL = '/api/auth-stores/analysis-contributors';
    static AUTH_ITEM_CONTRIBUTOR_URL = '/api/auth-stores/item-contributors';
    static AUTH_STORE_CONTRIBUTOR_URL = '/api/auth-stores/store-contributors';
    static AUTH_TABLE_CONTRIBUTOR_URL = '/api/auth-stores/ordering-contributors/table-contributors';
    static AUTH_SALE_CONTRIBUTOR_URL = '/api/auth-stores/ordering-contributors/sale-contributors';
    static AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL = '/api/auth-stores/ordering-contributors/ordering-configuration-contributors';
    static AUTH_PACKAGE_CONTRIBUTOR_URL = '/api/auth-stores/package-contributors'
    static AUTH_STORE_USER_URL = '/api/auth-users/store-users';
    static AUTH_USERS_URL = '/api/auth-users';
    static AUTH_TRACK_CONTRIBUTORS_URL = '/api/auth-stores/track-contributors'
    static AUTH_NOTIFICATION_USERS_URL = '/api/auth-users/notification-users';
    static FEATURE_URL = '/api/features';
    static CURRENCY_URL = '/api/currency';
    // static AUTH_ADVERTISING_CONTRIBUTOR_URL = '/api/auth-stores/advertising-contributors';
    // static AUTH_CART_CONTRIBUTOR_URL = '/api/auth-stores/cart-contributors';
    // static AUTH_CREDIT_CONTRIBUTOR_URL = '/api/auth-stores/credit-contributors';
    // static AUTH_IMAGE_CONTRIBUTOR_URL = '/api/auth-stores/image-contributors';
    // static Auth_FEATURE_CONTRIBUTOR_URL = '/api/auth-stores/feature-contributors';
    // static AUTH_PROMOTION_CONTRIBUTOR_URL = '/api/auth-stores/promotion-contributors';
    // static AUTH_RECRUITMENT_CONTRIBUTOR_URL = '/api/auth-stores/recruitment-contributors';
    // static AUTH_QUOTATION_CONTRIBUTOR_URL = '/api/auth-stores/quotation-contributors';
    // static AUTH_REVIEW_CONTRIBUTOR_URL = '/api/auth-stores/review-contributors';
    // static AUTH_VOURCHER_CONTRIBUTOR_URL = '/api/auth-stores/voucher-contributors';
    // static REVIEW_URL = '/api/reviews';
}
export class UserUrl {
    static loginUrl = URL.USER_URL + '/login';
    static registerUrl = URL.USER_URL + '/register';
    static registerByFbUrl = URL.USER_URL + '/register-by-fb';
    static registerByGoogleUrl = URL.USER_URL + '/register-by-google';
    static activateUrl = URL.USER_URL + '/activate';
    static savePasswordUrl = URL.USER_URL + '/save/password';
    static checkEmailUrl = URL.USER_URL + '/checkemail';
    static resetUsernameUrl = URL.USER_URL + '/reset/username';
    static resendActivationEmailConfirmationUrl = URL.USER_URL + '/resend/activation-email';
    static resendActivationEmailUrl = URL.USER_URL + '/resend/activation-email';
    static resetPasswordUrl = URL.USER_URL + '/reset/password';
    static isAuthenticatedUrl = URL.USER_URL + '/is-authenticated';
}
export class CategoryUrl {
    static getCategoriesByStoreIdUrl = URL.CATEGORY_URL + '/storeid/';
}
export class TrackUrl {
    static addTrackUrl = URL.TRACK_URL;
}
export class StoreUrl {
    static getStoreByUsernameUrl = URL.STORE_URL + '/username';
    static getStoreByKeywordUrl = URL.STORE_URL + '/search';
    static getRecommandedStoresUrl = URL.STORE_URL + '/random';
}
export class InvoiceUrl {
    static getInvoiceByIdUrl = URL.INVOICE_URL;
    static uploadPayslipUrl = URL.INVOICE_URL + '/upload-payslip';
}
export class ItemUrl {
    static getItemWithSellerByIdUrl = URL.ITEM_URL + '/items-with-seller';
    static getAllItemsByStoreIdUrl = URL.ITEM_URL + '/public/all';
    static getNewItemsByStoreIdUrl = URL.ITEM_URL + '/public/new';
    static getDiscountItemsByStoreIdUrl = URL.ITEM_URL + '/public/discount';
    static getTodaySpecialItemsByStoreIdUrl = URL.ITEM_URL + '/public/todayspecial';
    static getItemsByCategoryIdUrl = URL.ITEM_URL + '/public';
}
export class FeatureUrl {
    static sendEmailUrl = URL.FEATURE_URL + '/send/email';
    static sendReportReviewUrl = URL.FEATURE_URL + '/send/report';
    static sendStoreInvitationEmailUrl = URL.FEATURE_URL + 'send/invitation';
    static sendInformationUrl = URL.FEATURE_URL + 'send/information';
}
export class AuthInvoiceUrl {
    static getInvoicesUrl = URL.AUTH_INVOICE_URL;
    static placeorderUrl = URL.AUTH_INVOICE_URL + '/placeorder';
    static isSavedInvoiceUrl = URL.AUTH_INVOICE_URL + '/is-saved';
    static saveInvoiceUrl = URL.AUTH_INVOICE_URL + '/save';
    static unsaveInvoiceUrl = URL.AUTH_INVOICE_URL + '/unsave';

}
export class AuthUserUrl {
    static getUserUrl = URL.AUTH_USERS_URL + '/users';
    static getProfileUrl = URL.AUTH_USERS_URL + '/users/profile';
    static getAddressbookUrl = URL.AUTH_USERS_URL + '/users/address-book';
    static saveAddressbookUrl = URL.AUTH_USERS_URL + '/users/address-book';
    static removeAddressbookUrl = URL.AUTH_USERS_URL + '/users/address-book';
    static getPasswordExistedUrl = URL.AUTH_USERS_URL + '/users/is-password';
    static removeProfileImageUrl = URL.AUTH_USERS_URL + '/users/remove/profile-image';
    static editProfileUrl = URL.AUTH_USERS_URL + '/users/edit/profile-image';
    static editGeneralUrl = URL.AUTH_USERS_URL + '/users/edit/general';
    static changePasswordUrl = URL.AUTH_USERS_URL + '/users/edit/password';
    static savePasswordUrl = URL.AUTH_USERS_URL + '/users/save/password';
    static logout = URL.AUTH_USERS_URL + '/users/logout';
    // follow
    static getFollowStoresUrl = URL.AUTH_USERS_URL + '/users/follow/stores'
    static getFollowItemsUrl = URL.AUTH_USERS_URL + '/users/follow/items'
    static getFollowStoresByPositionUrl = URL.AUTH_USERS_URL + '/users/follow/stores/position'
    static getFollowItemsByPositionUrl = URL.AUTH_USERS_URL + '/users/follow/items/position'
    static getFollowStoreIdsUrl = URL.AUTH_USERS_URL + '/users/follow-ids'
    static getFollowItemIdsUrl = URL.AUTH_USERS_URL + '/users/follow-ids'
    static isFollowStoreUrl = URL.AUTH_USERS_URL + '/users/is-following'
    static isFollowItemUrl = URL.AUTH_USERS_URL + '/users/is-following'
    static followStoreUrl = URL.AUTH_USERS_URL + '/users/follow'
    static followItemUrl = URL.AUTH_USERS_URL + '/users/follow'
    static unfollowStoreUrl = URL.AUTH_USERS_URL + '/users/unfollow'
    static unfollowItemUrl = URL.AUTH_USERS_URL + '/users/unfollow'
}
export class AuthStoreUserUrl {
    static isAuthenticatedStoreByStoreUsernameUrl = URL.AUTH_STORE_USER_URL + '/is-authenticated';
    static getStoresByUserIdUrl = URL.AUTH_STORE_USER_URL + '/contributor';
    static getAuthenticatedStoreByStoreUsernameUrl = URL.AUTH_STORE_USER_URL + '/authenticated';
    static getNotActiveStoresByUserIdUrl = URL.AUTH_STORE_USER_URL + '/contributor/not-active';
    static getInvitationStoresByUserIdUrl = URL.AUTH_STORE_USER_URL + '/contributor/pending';
    static addStoreUrl = URL.AUTH_STORE_USER_URL + '/add';
}
export class AuthStoreContributorUrl {
    static getContributorsUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/contributors';
    static getStoreByUsernameUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/username/';
    static addBannerUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/add/banner-image';
    static editStoreByIdUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/';
    static editProfileUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/profile-image';
    static removeProfileUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/remove/profile-image';
    static editGeneralUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/general';
    static editContactUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/contact';
    static editBannerUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/banner-image';
    static removeBannerUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/remove/banner-image';
    static addMediaUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/media';
    static removeMediaUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/media/remove';
    static editMediaUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/media';
    static joinContributorUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/contributor/join';
    static rejectContributorUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/contributor/reject';
    static leaveStoreUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/leave';
    static editInformationImagesUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/information-image';
    static editInformationImagesOrderUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/rearrange/information-image';
    static removeInformationImageUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/remove/information-image';
    static editMenuImagesUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/edit/menu-image';
    static editMenuImagesOrderUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/rearrange/menu-image';
    static removeMenuImageUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/remove/menu-image';

    static advertiseItemsUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/advupdate';
    static updateNewItemMessageUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/updatemessage';
    static isPackageExpiredByUsernameUrl = URL.AUTH_STORE_CONTRIBUTOR_URL + '/is-expired';
}
export class AuthItemContributorUrl {
    static markAsNewUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/markasnew/items';
    static unmarkNewUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unmarknew/items';
    static markAsTodaySpecialUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/markastodayspecial/items';
    static unmarkTodaySpecialUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unmarktodayspecial/items';
    static markAsOfferUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/markasoffer/items';
    static unmarkOfferUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unmarkoffer/items';
    static getItemById = URL.AUTH_ITEM_CONTRIBUTOR_URL + '';
    static getItemsByCategoryIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/items-by-categoryid';
    static getAuthenticatedAllItemsByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/all';
    static getAuthenticatedNewItemsByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/new';
    static getAuthenticatedTodaySpecialItemsByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/todayspecial';
    static getAuthenticatedDiscountItemsByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/discount';
    static getAuthenticatedPublishedItemCategoryByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/published';
    static getAuthenticatedUnpublishedItemCategoryByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/unpublished';
    static getAuthenticatedUncategorizedItemCategoryByStoreIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/uncategorized';
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
    static getPreviewItemWithSellerByIdUrl = URL.AUTH_ITEM_CONTRIBUTOR_URL + '/preview/item';
}
export class AuthDefaultSettingContributorUrl {
    static getDefaultItemSettingByStoreIdUrl = URL.AUTH_DEFAULT_SETTING_CONTRIBUTOR_URL + '/item'
}
export class AuthCategoryContributorUrl {
    static getCategoryByNameAndStoreIdUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/name';
    static addCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static editCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static removeCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL;
    static removeCategoriesUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/remove/categories';
    static getAuthenticatedCategoriesByStoreIdUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/storeid';
    static addItemsToCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/items/add';
    static removeItemsFromCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/remove/itemsfromcategory';
    static moveCategoryUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/move';
    static rearrangeCategoriesUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/rearrange';
    static getNumberOfAllCategoriesItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_all_categories_items';
    static getNumberOfAllItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_all_items';
    static getNumberOfNewItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_new_items';
    static getNumberOfTodaySpecialItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_today_special_items';
    static getNumberOfDiscountItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_discount_items';
    static getNumberOfPublishedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_published_items';
    static getNumberOfUnpublishedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_unpublished_items';
    static getNumberOfUncategorizedItemsUrl = URL.AUTH_CATEGORY_CONTRIBUTOR_URL + '/number_of_uncategorized_items';

}
export class AuthStoreAdminUrl {
    static removeBankDetailslUrl = URL.AUTH_STORE_ADMIN_URL + '/bank-details/remove';
    static editBankDetailsUrl = URL.AUTH_STORE_ADMIN_URL + '/bank-details/edit';
    static searchContributorUrl = URL.AUTH_STORE_ADMIN_URL + '/search?query=';
    static inviteContributorUrl = URL.AUTH_STORE_ADMIN_URL + '/contributor/invite';
    static editContributorUrl = URL.AUTH_STORE_ADMIN_URL + '/contributor/edit';
    static removeContributorUrl = URL.AUTH_STORE_ADMIN_URL + '/contributor/remove';
    static publishStoreUrl = URL.AUTH_STORE_ADMIN_URL + '/publish';
    static unpublishStoreUrl = URL.AUTH_STORE_ADMIN_URL + '/unpublish';
    static closePermanentlyUrl = URL.AUTH_STORE_ADMIN_URL + '/close/permanently';
    static reactivateStoreUrl = URL.AUTH_STORE_ADMIN_URL + '/reactivate';
}
export class AuthPaymentMethodAdminUrl {
    static getPaymentMethodsByStoreIdUrl = URL.AUTH_PAYMENT_METHOD_ADMIN_URL + '/';
    static addPaymentMethodUrl = URL.AUTH_PAYMENT_METHOD_ADMIN_URL + '/';
    static removePaymentMethodUrl = URL.AUTH_PAYMENT_METHOD_ADMIN_URL + '/remove';
    static setDefaultPaymentMethodUrl = URL.AUTH_PAYMENT_METHOD_ADMIN_URL + '/set-default';
}
export class AuthDefaultSettingAdminUrl {
    static updateApprovalInvoiceUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL + '/invoice/approval';
    static updateToStartReceivingInvoicesUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL + '/invoice/start';
    static updateToStopReceivingInvoicesUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL + '/invoice/stop';
    static getDefaultSettingByStoreIdUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL;
    static setDefaultSettingByStoreIdUrl = URL.AUTH_DEFAULT_SETTING_ADMIN_URL + '/edit';
}
export class AuthStatementAdminUrl {
    static getStatementsBetweenDateUrl = URL.AUTH_STATEMENT_CONTRIBUTOR_URL + '/statements-between-dates';
}
export class AuthPackageAdminUrl {
    static getStorePackageUrl = URL.AUTH_PACKAGE_ADMIN_URL + '/';
    static changePackageUrl = URL.AUTH_PACKAGE_ADMIN_URL + '/change-package';
    static unsubscribePackageUrl = URL.AUTH_PACKAGE_ADMIN_URL + '/unsubscribe';
}
export class AuthTableContributorUrl {
    static getTablesUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/';
    static getTableUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/';
    static addTableUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/';
    static updateTableUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/';
    static uploadTablesUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/upload';
    static removeTableUrl = URL.AUTH_TABLE_CONTRIBUTOR_URL + '/';
}
export class AuthPackageContributorUrl {
    static isPackageExpiredByUsernameUrl = URL.AUTH_PACKAGE_CONTRIBUTOR_URL + '/is-expired';
}
export class AuthSaleContributorUrl {
    static getSalesBetweenDateUrl = URL.AUTH_SALE_CONTRIBUTOR_URL + '/sales-between-dates';
}
export class AuthOrderingConfigurationContributorUrl {
    static startOrderingServiceUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/';
    static getOrderingConfigurationUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/configuration';
    static renewMerchantCodeUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/renew-merchant-code';
    static addPageRoleUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/add-page-role';
    static addAnonymousPageRoleUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/add-anonymous-page-role';
    static updatePageRoleUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/update-page-role';
    static removePageRoleUrl = URL.AUTH_ORDERING_CONFIGURATION_CONTRIBUTOR_URL + '/remove-page-role/';
}
export class AuthCustomerContributorUrl {
    static getCustomersUrl = URL.AUTH_CUSTOMER_CONTRIBUTOR_URL + '/';
    static addCustomerUrl = URL.AUTH_CUSTOMER_CONTRIBUTOR_URL + '/';
    static updateCustomerUrl = URL.AUTH_CUSTOMER_CONTRIBUTOR_URL + '/';
    static removeCustomerUrl = URL.AUTH_CUSTOMER_CONTRIBUTOR_URL + '/';
}
export class AuthPromotionContributorUrl {
    static getPromotionsUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/';
    static addPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/';
    static updatePromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/';
    static removePromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/';
}
export class AuthTrackContributorUrl {
    static getTracksUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL + '/';
    static getTracksBetweenDatesUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL + '/tracks-between-dates';
    static getTodayTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL + '/today-track';
    static addNewTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL;
    static editNewTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL;
    static activateTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL + '/activate';
    static inactivateTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL + '/inactivate';
    static removeTrackUrl = URL.AUTH_TRACK_CONTRIBUTORS_URL;
}
export class AuthDeliveryContributorUrl {
    static getDeliveriesUrl = URL.AUTH_DELIVERY_CONTRIBUTOR_URL + '/';
    static addDeliveryUrl = URL.AUTH_DELIVERY_CONTRIBUTOR_URL + '/';
    static updateDeliveryUrl = URL.AUTH_DELIVERY_CONTRIBUTOR_URL + '/';
    static removeDeliveryUrl = URL.AUTH_DELIVERY_CONTRIBUTOR_URL + '/';
}
export class AuthInvoiceContributorUrl {
    static getInvoicesUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/list';
    static getInvoiceUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/';
    static addInvoiceUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/';
    static editInvoiceUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/';
    static updateInvoiceStatusUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/change-status';
    static getUnseenInvoicesUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/unseen'
    static getInvoiceGroupUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/group'
    static getInvoicesAnalysisUrl = URL.AUTH_INVOICE_CONTRIBUTOR_URL + '/analysis'
}
export class AuthInvoiceConfigurationContributorUrl {
    static startInvoiceFeatureUrl = URL.AUTH_INVOICE_CONFIGURATION_CONTRIBUTOR_URL + '/start-feature';
    static getInvoiceConfigurationUrl = URL.AUTH_INVOICE_CONFIGURATION_CONTRIBUTOR_URL + '/';
    static addInvoiceConfigurationUrl = URL.AUTH_INVOICE_CONFIGURATION_CONTRIBUTOR_URL + '/';
}
export class AuthAnalysisContributorUrl {
    static getGeneralAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/general';
    static getMonthSalesAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/sales';
    static getSalesBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/sales-between-dates';
    static getSalesDetailsBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/sales-details-between-dates';
    static getMonthlySalesDetailsBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/monthly-sales-details-between-dates';
    static getYearlySalesDetailsBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/yearly-sales-details-between-dates';
    static getSalesPreviewBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/sales-preview-between-dates';
    static getYearlySalesAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/sales-yearly';
    static getMonthDeliveryAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/delivery';
    static getDeliveryBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/delivery-between-dates';
    static getYearlyDeliveryAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/delivery-yearly';
    static getMonthInvoiceAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/invoice';
    static getInvoiceBetweenDatesUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/invoice-between-dates';
    static getYearlyInvoiceAnalysisUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/invoice-yearly';
    static getOngoingPromotionsUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/promotions/ongoing';
    static getPromotionsInvoiceNumberUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/promotions/invoice-number';
    static getPromotionInvoiceNumberBetweenDateUrl = URL.AUTH_ANALYSIS_CONTRIBUTOR_URL + '/promotions/invoice-number-between-date';
}
export class AuthNotificationUserUrl {
    // static getNotificationStreamUrl = URL.AUTH_NOTIFICATION_USERS_URL + '/sse';
    static checkNotificationsUrl = URL.AUTH_NOTIFICATION_USERS_URL + '/check-notifications';
    static getNotificationsUrl = URL.AUTH_NOTIFICATION_USERS_URL;
    static loadedNewNotificationsUrl = URL.AUTH_NOTIFICATION_USERS_URL + '/loaded';
    static readNotificationUrl = URL.AUTH_NOTIFICATION_USERS_URL + '/read';

}
export class CurrencyUrl {
    static getCurrencyUrl = URL.CURRENCY_URL + '/';
}
// export class AuthVoucherContributorUrl {
//     static getClaimedVouchersUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/claimed-vouchers';
//     static getClaimedVouchersInDetailsUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/claimed-vouchers-in-details';
//     static getUsedVouchersUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/used-vouchers';
//     static getUsedVouchersInDetailsUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/used-vouchers-in-details';
//     static publishPromotionUrl = URL.AUTH_VOURCHER_CONTRIBUTOR_URL + '/publish';
// }

// export class AuthReviewContributorUrl {
//     static getReviewByStoreIdUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/storeid';
//     static addReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/store-reply';
//     static editReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/store-reply/edit';
//     static removeReplyUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/store-reply/remove';
//     static getRepliesByReviewIdUrl = URL.AUTH_REVIEW_CONTRIBUTOR_URL + '/replies';
// }
// export class AuthQuotationContributorUrl {
//     static getUnrepliedRequestsUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/unreplied';
//     static getHistoryRequestsUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/history';
//     static getRejectRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/reject';
//     static replyQuotationRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/request/reply';
//     static inactivateRequestUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/request/inactivate';


//     static getQuotationUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template/create';
//     static createQuotationTemplate = URL.AUTH_QUOTATION_CONTRIBUTOR_URL;
//     static getQuotationTemplateUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template';
//     static editQuotationTemplateUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/template';
//     static getQuotationTemplatesUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/templates';
//     static getQuotationsByRequestIdUrl = URL.AUTH_QUOTATION_CONTRIBUTOR_URL + '/requestid';

// }
// export class AuthRecruitmentContributorUrl {
//     static createRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/add';
//     static editRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL;
//     static getRecruitmentByIdUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL;
//     static getRecruitmentsUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/storeid';
//     static extendRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/extend';
//     static postRecruitmentUrl = URL.AUTH_RECRUITMENT_CONTRIBUTOR_URL + '/post';
// }
// export class AuthPromotionContributorUrl {
//     static uploadPromotionImageUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/upload';
//     static createPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
//     static editPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
//     static getPromotionUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL;
//     static getPromotionsByStoreIdUrl = URL.AUTH_PROMOTION_CONTRIBUTOR_URL + '/storeid';
// }
// export class AuthImageContributorUrl {
//     static uploadProfileImagesToItemUrl = URL.AUTH_IMAGE_CONTRIBUTOR_URL + '/upload/profileimage';
//     static uploadDescriptionImagesToItemUrl = URL.AUTH_IMAGE_CONTRIBUTOR_URL + '/upload/descriptionimage';
// }

// export class AuthFeatureContributorUrl {
//     static purchaseRecruitmentUrl = URL.Auth_FEATURE_CONTRIBUTOR_URL + '/purchase/recruitment';
// }

// export class AuthCartContributorUrl {
//     static checkOutUrl = URL.AUTH_CART_CONTRIBUTOR_URL + '/checkout';
//     static precheckoutUrl = URL.AUTH_CART_CONTRIBUTOR_URL + '/precheckout';
// }

// export class AuthCreditContributorURL {
//     static getCreditUrl = URL.AUTH_CREDIT_CONTRIBUTOR_URL;
//     static startAdvertisingUrl = URL.AUTH_CREDIT_CONTRIBUTOR_URL + '/start-advertising';
// }

// export class AuthAdvertisingContributorUrl {
//     static getAdvertisingRecordUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/advertisingrecord';
//     static checkoutUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/checkout';
//     static checkoutFreeUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/checkoutfree';
//     static extendUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/extend';
//     static updateExpireAdvertisingUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/updateexpireadvertising';
//     static getFreeSlotsUrl = URL.AUTH_ADVERTISING_CONTRIBUTOR_URL + '/getfreeslots';
// }