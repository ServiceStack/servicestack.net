/* Options:
Date: 2023-03-19 10:01:09
Version: 6.71
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//AddServiceStackTypes: True
//AddDocAnnotations: True
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

"use strict";
/** @typedef {'Product'|'PerDev'|'PerCore'|'Site'|'Support'|'Training'|'Register'|'Payment'} */
export var SkuType;
(function (SkuType) {
    SkuType["Product"] = "Product"
    SkuType["PerDev"] = "PerDev"
    SkuType["PerCore"] = "PerCore"
    SkuType["Site"] = "Site"
    SkuType["Support"] = "Support"
    SkuType["Training"] = "Training"
    SkuType["Register"] = "Register"
    SkuType["Payment"] = "Payment"
})(SkuType || (SkuType = {}));
/** @typedef {'Free'|'FreeIndividual'|'FreeOpenSource'|'Indie'|'Business'|'Enterprise'|'TextIndie'|'TextBusiness'|'OrmLiteIndie'|'OrmLiteBusiness'|'RedisIndie'|'RedisBusiness'|'AwsIndie'|'AwsBusiness'|'Trial'|'Site'|'TextSite'|'RedisSite'|'OrmLiteSite'} */
export var LicenseType;
(function (LicenseType) {
    LicenseType["Free"] = "Free"
    LicenseType["FreeIndividual"] = "FreeIndividual"
    LicenseType["FreeOpenSource"] = "FreeOpenSource"
    LicenseType["Indie"] = "Indie"
    LicenseType["Business"] = "Business"
    LicenseType["Enterprise"] = "Enterprise"
    LicenseType["TextIndie"] = "TextIndie"
    LicenseType["TextBusiness"] = "TextBusiness"
    LicenseType["OrmLiteIndie"] = "OrmLiteIndie"
    LicenseType["OrmLiteBusiness"] = "OrmLiteBusiness"
    LicenseType["RedisIndie"] = "RedisIndie"
    LicenseType["RedisBusiness"] = "RedisBusiness"
    LicenseType["AwsIndie"] = "AwsIndie"
    LicenseType["AwsBusiness"] = "AwsBusiness"
    LicenseType["Trial"] = "Trial"
    LicenseType["Site"] = "Site"
    LicenseType["TextSite"] = "TextSite"
    LicenseType["RedisSite"] = "RedisSite"
    LicenseType["OrmLiteSite"] = "OrmLiteSite"
})(LicenseType || (LicenseType = {}));
export class LicenseKey {
    /** @param {{ref?:string,name?:string,type?:LicenseType,meta?:number,hash?:string,expiry?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    ref;
    /** @type {string} */
    name;
    /** @type {LicenseType} */
    type;
    /** @type {number} */
    meta;
    /** @type {string} */
    hash;
    /** @type {string} */
    expiry;
}
export class Subscription {
    /** @param {{id?:number,customerId?:number,email?:string,skuId?:number,skuName?:string,skuType?:SkuType,code?:string,quantity?:number,supportQuantity?:number,total?:number,isPlan?:boolean,isRenewal?:boolean,subscriptionDurationDays?:number,renewalDate?:string,licenseRef?:string,licenseName?:string,licenseAddress?:string,licenseType?:LicenseType,expiryDate?:string,licenseKey?:LicenseKey,licenseKeyText?:string,createdDate?:string,modifiedDate?:string,cancelledDate?:string,stripeSubscriptionId?:string,emailId?:number,emailRenewalId?:number,emailExpiredId?:number,renewalSubscriptionId?:number,externalRef?:string,notes?:string,error?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    customerId;
    /** @type {string} */
    email;
    /** @type {number} */
    skuId;
    /** @type {string} */
    skuName;
    /** @type {SkuType} */
    skuType;
    /** @type {string} */
    code;
    /** @type {number} */
    quantity;
    /** @type {number} */
    supportQuantity;
    /** @type {number} */
    total;
    /** @type {boolean} */
    isPlan;
    /** @type {boolean} */
    isRenewal;
    /** @type {number} */
    subscriptionDurationDays;
    /** @type {?string} */
    renewalDate;
    /** @type {string} */
    licenseRef;
    /** @type {string} */
    licenseName;
    /** @type {string} */
    licenseAddress;
    /** @type {LicenseType} */
    licenseType;
    /** @type {string} */
    expiryDate;
    /** @type {LicenseKey} */
    licenseKey;
    /** @type {string} */
    licenseKeyText;
    /** @type {string} */
    createdDate;
    /** @type {string} */
    modifiedDate;
    /** @type {?string} */
    cancelledDate;
    /** @type {string} */
    stripeSubscriptionId;
    /** @type {?number} */
    emailId;
    /** @type {?number} */
    emailRenewalId;
    /** @type {?number} */
    emailExpiredId;
    /** @type {?number} */
    renewalSubscriptionId;
    /** @type {string} */
    externalRef;
    /** @type {string} */
    notes;
    /** @type {string} */
    error;
}
/** @typedef {number} */
export var LicenseFeature;
(function (LicenseFeature) {
    LicenseFeature[LicenseFeature["Free"] = 0] = "Free"
    LicenseFeature[LicenseFeature["None"] = 0] = "None"
    LicenseFeature[LicenseFeature["Premium"] = 1] = "Premium"
    LicenseFeature[LicenseFeature["Text"] = 2] = "Text"
    LicenseFeature[LicenseFeature["Client"] = 4] = "Client"
    LicenseFeature[LicenseFeature["Common"] = 8] = "Common"
    LicenseFeature[LicenseFeature["Redis"] = 16] = "Redis"
    LicenseFeature[LicenseFeature["RedisSku"] = 18] = "RedisSku"
    LicenseFeature[LicenseFeature["OrmLite"] = 32] = "OrmLite"
    LicenseFeature[LicenseFeature["OrmLiteSku"] = 34] = "OrmLiteSku"
    LicenseFeature[LicenseFeature["ServiceStack"] = 64] = "ServiceStack"
    LicenseFeature[LicenseFeature["Server"] = 128] = "Server"
    LicenseFeature[LicenseFeature["Razor"] = 256] = "Razor"
    LicenseFeature[LicenseFeature["Admin"] = 512] = "Admin"
    LicenseFeature[LicenseFeature["Aws"] = 1024] = "Aws"
    LicenseFeature[LicenseFeature["AwsSku"] = 1026] = "AwsSku"
    LicenseFeature[LicenseFeature["All"] = 2047] = "All"
})(LicenseFeature || (LicenseFeature = {}));
export class Sku {
    /** @param {{id?:number,productId?:number,type?:SkuType,feature?:LicenseFeature,code?:string,name?:string,notes?:string,maxQty?:number,price?:number,plan?:string,discountOff?:number,discountLabelOff?:string,actualPrice?:number,isPlan?:boolean,isRenewal?:boolean,subscriptionDurationDays?:number,expiryDurationDays?:number,trialPeriodDays?:number,supportQty?:number,coresQty?:number,createdDate?:string,modifiedDate?:string,licenseType?:LicenseType,active?:boolean}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    productId;
    /** @type {SkuType} */
    type;
    /** @type {LicenseFeature} */
    feature;
    /** @type {string} */
    code;
    /** @type {string} */
    name;
    /** @type {string} */
    notes;
    /** @type {?number} */
    maxQty;
    /** @type {number} */
    price;
    /** @type {string} */
    plan;
    /** @type {number} */
    discountOff;
    /** @type {string} */
    discountLabelOff;
    /** @type {number} */
    actualPrice;
    /** @type {boolean} */
    isPlan;
    /** @type {boolean} */
    isRenewal;
    /** @type {?number} */
    subscriptionDurationDays;
    /** @type {?number} */
    expiryDurationDays;
    /** @type {?number} */
    trialPeriodDays;
    /** @type {number} */
    supportQty;
    /** @type {?number} */
    coresQty;
    /** @type {string} */
    createdDate;
    /** @type {string} */
    modifiedDate;
    /** @type {LicenseType} */
    licenseType;
    /** @type {boolean} */
    active;
}
export class QueryBase {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {?number} */
    skip;
    /** @type {?number} */
    take;
    /** @type {string} */
    orderBy;
    /** @type {string} */
    orderByDesc;
    /** @type {string} */
    include;
    /** @type {string} */
    fields;
    /** @type {{ [index: string]: string; }} */
    meta;
}
/** @typedef T {any} */
export class QueryDb extends QueryBase {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
}
export class OrderDetail {
    /** @param {{id?:number,orderId?:number,skuId?:number,skuType?:SkuType,price?:number,description?:string,quantity?:number,total?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    orderId;
    /** @type {number} */
    skuId;
    /** @type {SkuType} */
    skuType;
    /** @type {number} */
    price;
    /** @type {string} */
    description;
    /** @type {number} */
    quantity;
    /** @type {number} */
    total;
}
export class OrderAnalyticData {
    /** @param {{productName?:string,subTotal?:number,couponId?:string,discount?:number,tax?:number,total?:number,paid?:boolean,createdDate?:string,modifiedDate?:string,modifiedBy?:string,cancelledDate?:string,cancelledReason?:string,orderDetails?:OrderDetail[]}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    productName;
    /** @type {number} */
    subTotal;
    /** @type {string} */
    couponId;
    /** @type {number} */
    discount;
    /** @type {number} */
    tax;
    /** @type {number} */
    total;
    /** @type {boolean} */
    paid;
    /** @type {string} */
    createdDate;
    /** @type {string} */
    modifiedDate;
    /** @type {string} */
    modifiedBy;
    /** @type {?string} */
    cancelledDate;
    /** @type {string} */
    cancelledReason;
    /** @type {OrderDetail[]} */
    orderDetails;
}
export class ResponseError {
    /** @param {{errorCode?:string,fieldName?:string,message?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    errorCode;
    /** @type {string} */
    fieldName;
    /** @type {string} */
    message;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class ResponseStatus {
    /** @param {{errorCode?:string,message?:string,stackTrace?:string,errors?:ResponseError[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    errorCode;
    /** @type {string} */
    message;
    /** @type {string} */
    stackTrace;
    /** @type {ResponseError[]} */
    errors;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class Invoice {
    /** @param {{orderId?:number,date?:string,description?:string,itemQuantity?:number,total?:number,paid?:boolean}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    orderId;
    /** @type {string} */
    date;
    /** @type {string} */
    description;
    /** @type {number} */
    itemQuantity;
    /** @type {number} */
    total;
    /** @type {boolean} */
    paid;
}
export class Payment {
    /** @param {{id?:number,customerId?:number,subscriptionId?:number,type?:string,discountAmount?:number,amount?:number,stripeCustomerId?:string,stripeChargeId?:string,stripeInvoiceId?:string,stripeSubscriptionId?:string,createdDate?:string,refundAmount?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    customerId;
    /** @type {?number} */
    subscriptionId;
    /** @type {string} */
    type;
    /** @type {number} */
    discountAmount;
    /** @type {number} */
    amount;
    /** @type {string} */
    stripeCustomerId;
    /** @type {string} */
    stripeChargeId;
    /** @type {string} */
    stripeInvoiceId;
    /** @type {string} */
    stripeSubscriptionId;
    /** @type {string} */
    createdDate;
    /** @type {?number} */
    refundAmount;
}
export class SubscriptionsResponse {
    /** @param {{section?:string,supportQuantity?:number,activeSku?:Sku,activeSubscription?:Subscription,inActiveSubscriptions?:Subscription[],purchasedOrder?:OrderAnalyticData,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    section;
    /** @type {number} */
    supportQuantity;
    /** @type {Sku} */
    activeSku;
    /** @type {Subscription} */
    activeSubscription;
    /** @type {Subscription[]} */
    inActiveSubscriptions;
    /** @type {OrderAnalyticData} */
    purchasedOrder;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class SupportContact {
    /** @param {{id?:number,customerId?:number,name?:string,email?:string,gitHub?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    customerId;
    /** @type {string} */
    name;
    /** @type {string} */
    email;
    /** @type {string} */
    gitHub;
}
export class SupportResponse {
    /** @param {{activeSubscription?:Subscription,section?:string,maxQuantity?:number,supportQuantity?:number,skuType?:string,supportContacts?:SupportContact[],responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Subscription} */
    activeSubscription;
    /** @type {string} */
    section;
    /** @type {number} */
    maxQuantity;
    /** @type {number} */
    supportQuantity;
    /** @type {string} */
    skuType;
    /** @type {SupportContact[]} */
    supportContacts;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class BillingHistoryResponse {
    /** @param {{invoices?:Invoice[],responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Invoice[]} */
    invoices;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class Order {
    /** @param {{id?:number,customerId?:number,productName?:string,firstName?:string,lastName?:string,email?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string,agreeTerms?:boolean,notes?:string,last4?:string,subTotal?:number,couponId?:string,discount?:number,tax?:number,total?:number,itemQuantity?:number,authorizedQuantity?:number,subscriptionId?:number,licenseRef?:string,paymentId?:number,emailId?:number,paid?:boolean,createdDate?:string,modifiedDate?:string,modifiedBy?:string,cancelledDate?:string,cancelledReason?:string,ipAddress?:string,orderDetails?:OrderDetail[]}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    customerId;
    /** @type {string} */
    productName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
    /** @type {boolean} */
    agreeTerms;
    /** @type {string} */
    notes;
    /** @type {string} */
    last4;
    /** @type {number} */
    subTotal;
    /** @type {string} */
    couponId;
    /** @type {number} */
    discount;
    /** @type {number} */
    tax;
    /** @type {number} */
    total;
    /** @type {number} */
    itemQuantity;
    /** @type {?number} */
    authorizedQuantity;
    /** @type {?number} */
    subscriptionId;
    /** @type {string} */
    licenseRef;
    /** @type {?number} */
    paymentId;
    /** @type {?number} */
    emailId;
    /** @type {boolean} */
    paid;
    /** @type {string} */
    createdDate;
    /** @type {string} */
    modifiedDate;
    /** @type {string} */
    modifiedBy;
    /** @type {?string} */
    cancelledDate;
    /** @type {string} */
    cancelledReason;
    /** @type {string} */
    ipAddress;
    /** @type {OrderDetail[]} */
    orderDetails;
}
export class Customer {
    /** @param {{id?:number,email?:string,displayName?:string,firstName?:string,lastName?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string,stripeCustomerId?:string,stripeCouponId?:string,plan?:string,createdDate?:string,isReferrer?:boolean,orders?:Order[],subscriptions?:Subscription[]}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {string} */
    email;
    /** @type {string} */
    displayName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
    /** @type {string} */
    stripeCustomerId;
    /** @type {string} */
    stripeCouponId;
    /** @type {string} */
    plan;
    /** @type {string} */
    createdDate;
    /** @type {boolean} */
    isReferrer;
    /** @type {Order[]} */
    orders;
    /** @type {Subscription[]} */
    subscriptions;
    getTypeName() { return 'Customer' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class CachedResponse {
    /** @param {{result?:string,counter?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    result;
    /** @type {number} */
    counter;
}
export class EmptyResponse {
    /** @param {{responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {ResponseStatus} */
    responseStatus;
}
export class FreeLicenseResponse {
    /** @param {{licenseName?:string,licenseRef?:string,licenseKey?:string,licenseType?:LicenseType,createdDate?:string,expiryDate?:string,externalRef?:string,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    licenseName;
    /** @type {string} */
    licenseRef;
    /** @type {string} */
    licenseKey;
    /** @type {?LicenseType} */
    licenseType;
    /** @type {?string} */
    createdDate;
    /** @type {?string} */
    expiryDate;
    /** @type {string} */
    externalRef;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class ActivateSubscriptionResponse {
    /** @param {{subscription?:Subscription,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Subscription} */
    subscription;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class Hello {
    /** @param {{name?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    name;
    getTypeName() { return 'Hello' }
    getMethod() { return 'POST' }
    createResponse() { return new Hello() }
}
export class PaymentsResponse {
    /** @param {{orders?:Order[],payments?:Payment[]}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Order[]} */
    orders;
    /** @type {Payment[]} */
    payments;
}
export class Product {
    /** @param {{id?:number,name?:string,createdDate?:string,modifiedDate?:string,skus?:Sku[],active?:boolean}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {string} */
    name;
    /** @type {string} */
    createdDate;
    /** @type {string} */
    modifiedDate;
    /** @type {Sku[]} */
    skus;
    /** @type {boolean} */
    active;
    getTypeName() { return 'Product' }
    getMethod() { return 'GET' }
    createResponse() { return new Product() }
}
export class PricingResponse {
    /** @param {{indie?:Sku,indieRenewal?:Sku,business?:Sku,businessRenewal?:Sku,enterprise?:Sku,indieSubscription?:Sku,businessSubscription?:Sku,enterpriseSubscription?:Sku,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Sku} */
    indie;
    /** @type {Sku} */
    indieRenewal;
    /** @type {Sku} */
    business;
    /** @type {Sku} */
    businessRenewal;
    /** @type {Sku} */
    enterprise;
    /** @type {Sku} */
    indieSubscription;
    /** @type {Sku} */
    businessSubscription;
    /** @type {Sku} */
    enterpriseSubscription;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class PricingCoresResponse {
    /** @param {{cores04Subscription?:Sku,cores08Subscription?:Sku,cores16Subscription?:Sku,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Sku} */
    cores04Subscription;
    /** @type {Sku} */
    cores08Subscription;
    /** @type {Sku} */
    cores16Subscription;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class RenewResponse {
    /** @param {{subscriptions?:Subscription[],responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {Subscription[]} */
    subscriptions;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class QuoteResponse {
    /** @param {{skuId?:number,code?:string,customerId?:number,modifyingExistingSubscription?:boolean,changingSubscriptions?:boolean,switchingLicensingModels?:boolean,replacesExistingQuantity?:boolean,existingSubscriptionQuantity?:number,newSubscriptionQuantity?:number,unusedAmount?:string,manualProrating?:boolean,unusedDays?:number,quantity?:number,minQuantity?:number,maxQuantity?:number,subtotal?:string,discountDescription?:string,discountReceived?:string,discount?:string,total?:string,expiryDate?:string,renewalDate?:string,isReferrer?:boolean,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    skuId;
    /** @type {string} */
    code;
    /** @type {?number} */
    customerId;
    /** @type {boolean} */
    modifyingExistingSubscription;
    /** @type {boolean} */
    changingSubscriptions;
    /** @type {boolean} */
    switchingLicensingModels;
    /** @type {boolean} */
    replacesExistingQuantity;
    /** @type {?number} */
    existingSubscriptionQuantity;
    /** @type {?number} */
    newSubscriptionQuantity;
    /** @type {string} */
    unusedAmount;
    /** @type {boolean} */
    manualProrating;
    /** @type {number} */
    unusedDays;
    /** @type {number} */
    quantity;
    /** @type {number} */
    minQuantity;
    /** @type {?number} */
    maxQuantity;
    /** @type {string} */
    subtotal;
    /** @type {string} */
    discountDescription;
    /** @type {string} */
    discountReceived;
    /** @type {string} */
    discount;
    /** @type {string} */
    total;
    /** @type {string} */
    expiryDate;
    /** @type {string} */
    renewalDate;
    /** @type {boolean} */
    isReferrer;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class BuyResponse {
    /** @param {{coupon?:string,renewalRef?:string,upgradeRef?:string,sku?:Sku,quote?:QuoteResponse,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    coupon;
    /** @type {string} */
    renewalRef;
    /** @type {string} */
    upgradeRef;
    /** @type {Sku} */
    sku;
    /** @type {QuoteResponse} */
    quote;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class UserInfo {
    /** @param {{id?:number,userAuthId?:string,nickName?:string,firstName?:string,lastName?:string,email?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {string} */
    userAuthId;
    /** @type {string} */
    nickName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
}
export class AuthenticateResponse {
    /** @param {{userId?:string,sessionId?:string,userName?:string,displayName?:string,referrerUrl?:string,bearerToken?:string,refreshToken?:string,profileUrl?:string,roles?:string[],permissions?:string[],responseStatus?:ResponseStatus,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    userId;
    /** @type {string} */
    sessionId;
    /** @type {string} */
    userName;
    /** @type {string} */
    displayName;
    /** @type {string} */
    referrerUrl;
    /** @type {string} */
    bearerToken;
    /** @type {string} */
    refreshToken;
    /** @type {string} */
    profileUrl;
    /** @type {string[]} */
    roles;
    /** @type {string[]} */
    permissions;
    /** @type {ResponseStatus} */
    responseStatus;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class AssignRolesResponse {
    /** @param {{allRoles?:string[],allPermissions?:string[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string[]} */
    allRoles;
    /** @type {string[]} */
    allPermissions;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class UnAssignRolesResponse {
    /** @param {{allRoles?:string[],allPermissions?:string[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string[]} */
    allRoles;
    /** @type {string[]} */
    allPermissions;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class RegisterResponse {
    /** @param {{userId?:string,sessionId?:string,userName?:string,referrerUrl?:string,bearerToken?:string,refreshToken?:string,roles?:string[],permissions?:string[],responseStatus?:ResponseStatus,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    userId;
    /** @type {string} */
    sessionId;
    /** @type {string} */
    userName;
    /** @type {string} */
    referrerUrl;
    /** @type {string} */
    bearerToken;
    /** @type {string} */
    refreshToken;
    /** @type {string[]} */
    roles;
    /** @type {string[]} */
    permissions;
    /** @type {ResponseStatus} */
    responseStatus;
    /** @type {{ [index: string]: string; }} */
    meta;
}
/** @typedef T {any} */
export class QueryResponse {
    /** @param {{offset?:number,total?:number,results?:T[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    offset;
    /** @type {number} */
    total;
    /** @type {T[]} */
    results;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class FallbackForClientRoutes {
    /** @param {{pathInfo?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    pathInfo;
    getTypeName() { return 'FallbackForClientRoutes' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class Subscriptions {
    /** @param {{section?:string,success?:boolean,activated?:boolean,purchasedOrderId?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    section;
    /** @type {boolean} */
    success;
    /** @type {boolean} */
    activated;
    /** @type {?number} */
    purchasedOrderId;
    getTypeName() { return 'Subscriptions' }
    getMethod() { return 'GET' }
    createResponse() { return new SubscriptionsResponse() }
}
export class CancelSubscription {
    /** @param {{id?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    getTypeName() { return 'CancelSubscription' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class Support {
    /** @param {{section?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    section;
    getTypeName() { return 'Support' }
    getMethod() { return 'POST' }
    createResponse() { return new SupportResponse() }
}
export class AddSupportContact {
    /** @param {{name?:string,email?:string,gitHub?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    name;
    /** @type {string} */
    email;
    /** @type {string} */
    gitHub;
    getTypeName() { return 'AddSupportContact' }
    getMethod() { return 'POST' }
    createResponse() { return new SupportContact() }
}
export class DeleteSupportContact {
    /** @param {{id?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    getTypeName() { return 'DeleteSupportContact' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class BillingHistory {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'BillingHistory' }
    getMethod() { return 'POST' }
    createResponse() { return new BillingHistoryResponse() }
}
export class AccountSettings {
    /** @param {{displayName?:string,firstName?:string,lastName?:string,company?:string,phoneNumber?:string,showCard?:boolean,brand?:string,last4?:string,cardNumber?:string,cvc?:string,expMonth?:number,expYear?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    displayName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {boolean} */
    showCard;
    /** @type {string} */
    brand;
    /** @type {string} */
    last4;
    /** @type {string} */
    cardNumber;
    /** @type {string} */
    cvc;
    /** @type {number} */
    expMonth;
    /** @type {number} */
    expYear;
    getTypeName() { return 'AccountSettings' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class ChangePassword {
    /** @param {{email?:string,oldPassword?:string,newPassword?:string,confirm?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    email;
    /** @type {string} */
    oldPassword;
    /** @type {string} */
    newPassword;
    /** @type {string} */
    confirm;
    getTypeName() { return 'ChangePassword' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class ViewOrder {
    /** @param {{id?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    getTypeName() { return 'ViewOrder' }
    getMethod() { return 'GET' }
    createResponse() { return new Order() }
}
export class CreateCustomer {
    /** @param {{firstName?:string,lastName?:string,email?:string,password?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string,createdDate?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {string} */
    password;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
    /** @type {?string} */
    createdDate;
    getTypeName() { return 'CreateCustomer' }
    getMethod() { return 'POST' }
    createResponse() { return new Customer() }
}
export class GetRepoArchive {
    /** @param {{user?:string,repo?:string,name?:string,tag?:string,mix?:string[]}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    user;
    /** @type {string} */
    repo;
    /** @type {string} */
    name;
    /** @type {string} */
    tag;
    /** @type {string[]} */
    mix;
    getTypeName() { return 'GetRepoArchive' }
    getMethod() { return 'GET' }
    createResponse() { return new Blob() }
}
export class Cached {
    /** @param {{id?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    id;
    getTypeName() { return 'Cached' }
    getMethod() { return 'POST' }
    createResponse() { return new CachedResponse() }
}
export class SendMessage {
    /** @param {{displayName?:string,email?:string,subject?:string,body?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    displayName;
    /** @type {string} */
    email;
    /** @type {string} */
    subject;
    /** @type {string} */
    body;
    getTypeName() { return 'SendMessage' }
    getMethod() { return 'POST' }
    createResponse() { return new EmptyResponse() }
}
export class GetFreeLicense {
    /** @param {{ref?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    ref;
    getTypeName() { return 'GetFreeLicense' }
    getMethod() { return 'GET' }
    createResponse() { return new FreeLicenseResponse() }
}
export class CreateIndividualLicense {
    /** @param {{licenseName?:string,agreeTerms?:boolean}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    licenseName;
    /** @type {boolean} */
    agreeTerms;
    getTypeName() { return 'CreateIndividualLicense' }
    getMethod() { return 'POST' }
    createResponse() { return new FreeLicenseResponse() }
}
export class CreateOpenSourceLicense {
    /** @param {{licenseName?:string,projectUrl?:string,licenseSpdx?:string,agreeTerms?:boolean}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    licenseName;
    /** @type {string} */
    projectUrl;
    /** @type {string} */
    licenseSpdx;
    /** @type {boolean} */
    agreeTerms;
    getTypeName() { return 'CreateOpenSourceLicense' }
    getMethod() { return 'POST' }
    createResponse() { return new FreeLicenseResponse() }
}
export class GetLicenseCertificate {
    /** @param {{ref?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    ref;
    getTypeName() { return 'GetLicenseCertificate' }
    getMethod() { return 'GET' }
    createResponse() { return '' }
}
export class Ping {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'Ping' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class PurchaseSubscription {
    /** @param {{code?:string,coupon?:string,renewalRef?:string,upgradeRef?:string,quantity?:number,userAuthId?:string,skuId?:number,agreeTerms?:boolean,firstName?:string,lastName?:string,email?:string,password?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string,licenseName?:string,licenseEmail?:string,licenseAddress?:string,cardNumber?:string,cvc?:string,expMonth?:number,expYear?:number,notes?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    code;
    /** @type {string} */
    coupon;
    /** @type {string} */
    renewalRef;
    /** @type {string} */
    upgradeRef;
    /** @type {number} */
    quantity;
    /** @type {string} */
    userAuthId;
    /** @type {number} */
    skuId;
    /** @type {boolean} */
    agreeTerms;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {string} */
    password;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
    /** @type {string} */
    licenseName;
    /** @type {string} */
    licenseEmail;
    /** @type {string} */
    licenseAddress;
    /** @type {string} */
    cardNumber;
    /** @type {string} */
    cvc;
    /** @type {number} */
    expMonth;
    /** @type {number} */
    expYear;
    /** @type {string} */
    notes;
    getTypeName() { return 'PurchaseSubscription' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class ActivateSubscription {
    /** @param {{externalRef?:string,userAuthId?:string,agreeTerms?:boolean,firstName?:string,lastName?:string,email?:string,password?:string,company?:string,phoneNumber?:string,addressLine1?:string,addressLine2?:string,addressCity?:string,addressZip?:string,addressState?:string,addressCountry?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    externalRef;
    /** @type {string} */
    userAuthId;
    /** @type {boolean} */
    agreeTerms;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    email;
    /** @type {string} */
    password;
    /** @type {string} */
    company;
    /** @type {string} */
    phoneNumber;
    /** @type {string} */
    addressLine1;
    /** @type {string} */
    addressLine2;
    /** @type {string} */
    addressCity;
    /** @type {string} */
    addressZip;
    /** @type {string} */
    addressState;
    /** @type {string} */
    addressCountry;
    getTypeName() { return 'ActivateSubscription' }
    getMethod() { return 'GET' }
    createResponse() { return new ActivateSubscriptionResponse() }
}
export class MythzBlog {
    /** @param {{p?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {?number} */
    p;
    getTypeName() { return 'MythzBlog' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class OldDocs {
    /** @param {{path?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    path;
    getTypeName() { return 'OldDocs' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class OldFiles {
    /** @param {{path?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    path;
    getTypeName() { return 'OldFiles' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class GettingStarted {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'GettingStarted' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectApps {
    /** @param {{name?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    name;
    getTypeName() { return 'RedirectApps' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectVSTemplates {
    /** @param {{name?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    name;
    getTypeName() { return 'RedirectVSTemplates' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class AllDb {
    /** @param {{skip?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {?number} */
    skip;
    getTypeName() { return 'AllDb' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class Payments {
    /** @param {{skip?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {?number} */
    skip;
    getTypeName() { return 'Payments' }
    getMethod() { return 'GET' }
    createResponse() { return new PaymentsResponse() }
}
export class Login {
    /** @param {{redirect?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    redirect;
    getTypeName() { return 'Login' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class Pricing {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'Pricing' }
    getMethod() { return 'GET' }
    createResponse() { return new PricingResponse() }
}
export class PricingCores {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'PricingCores' }
    getMethod() { return 'GET' }
    createResponse() { return new PricingCoresResponse() }
}
export class PricingText {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'PricingText' }
    getMethod() { return 'GET' }
    createResponse() { return new PricingResponse() }
}
export class PricingRedis {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'PricingRedis' }
    getMethod() { return 'GET' }
    createResponse() { return new PricingResponse() }
}
export class PricingOrmLite {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'PricingOrmLite' }
    getMethod() { return 'GET' }
    createResponse() { return new PricingResponse() }
}
export class Renew {
    /** @param {{licenseRef?:string,licenseKey?:string,error?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    licenseRef;
    /** @type {string} */
    licenseKey;
    /** @type {string} */
    error;
    getTypeName() { return 'Renew' }
    getMethod() { return 'GET' }
    createResponse() { return new RenewResponse() }
}
export class Buy {
    /** @param {{id?:string,coupon?:string,quantity?:number,renewalRef?:string,upgradeRef?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    id;
    /** @type {string} */
    coupon;
    /** @type {?number} */
    quantity;
    /** @type {string} */
    renewalRef;
    /** @type {string} */
    upgradeRef;
    getTypeName() { return 'Buy' }
    getMethod() { return 'GET' }
    createResponse() { return new BuyResponse() }
}
export class GetQuote {
    /** @param {{id?:number,quantity?:number,coupon?:string,renewalRef?:string,upgradeRef?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {number} */
    id;
    /** @type {number} */
    quantity;
    /** @type {string} */
    coupon;
    /** @type {string} */
    renewalRef;
    /** @type {string} */
    upgradeRef;
    getTypeName() { return 'GetQuote' }
    getMethod() { return 'GET' }
    createResponse() { return new QuoteResponse() }
}
export class MyInfo {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'MyInfo' }
    getMethod() { return 'GET' }
    createResponse() { return new UserInfo() }
}
export class Gravatar {
    /** @param {{id?:string,size?:number}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    id;
    /** @type {?number} */
    size;
    getTypeName() { return 'Gravatar' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class RedirectReleaseNotes {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'RedirectReleaseNotes' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectSwiftJsonServiceClient {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'RedirectSwiftJsonServiceClient' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectSwiftRef {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'RedirectSwiftRef' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectRedisReact {
    constructor(init) { Object.assign(this, init) }
    getTypeName() { return 'RedirectRedisReact' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RedirectVersionSwiftJsonServiceClient {
    /** @param {{xCodeVersion?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    xCodeVersion;
    getTypeName() { return 'RedirectVersionSwiftJsonServiceClient' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class RequestPasswordReset {
    /** @param {{email?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    email;
    getTypeName() { return 'RequestPasswordReset' }
    getMethod() { return 'POST' }
    createResponse () { };
}
export class ResetUserPassword {
    /** @param {{resetToken?:string,email?:string,newPassword?:string,confirm?:string}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    resetToken;
    /** @type {string} */
    email;
    /** @type {string} */
    newPassword;
    /** @type {string} */
    confirm;
    getTypeName() { return 'ResetUserPassword' }
    getMethod() { return 'GET' }
    createResponse () { };
}
export class Authenticate {
    /** @param {{provider?:string,state?:string,oauth_token?:string,oauth_verifier?:string,userName?:string,password?:string,rememberMe?:boolean,errorView?:string,nonce?:string,uri?:string,response?:string,qop?:string,nc?:string,cnonce?:string,accessToken?:string,accessTokenSecret?:string,scope?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /**
     * @type {string}
     * @description AuthProvider, e.g. credentials */
    provider;
    /** @type {string} */
    state;
    /** @type {string} */
    oauth_token;
    /** @type {string} */
    oauth_verifier;
    /** @type {string} */
    userName;
    /** @type {string} */
    password;
    /** @type {?boolean} */
    rememberMe;
    /** @type {string} */
    errorView;
    /** @type {string} */
    nonce;
    /** @type {string} */
    uri;
    /** @type {string} */
    response;
    /** @type {string} */
    qop;
    /** @type {string} */
    nc;
    /** @type {string} */
    cnonce;
    /** @type {string} */
    accessToken;
    /** @type {string} */
    accessTokenSecret;
    /** @type {string} */
    scope;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'Authenticate' }
    getMethod() { return 'POST' }
    createResponse() { return new AuthenticateResponse() }
}
export class AssignRoles {
    /** @param {{userName?:string,permissions?:string[],roles?:string[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    userName;
    /** @type {string[]} */
    permissions;
    /** @type {string[]} */
    roles;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'AssignRoles' }
    getMethod() { return 'POST' }
    createResponse() { return new AssignRolesResponse() }
}
export class UnAssignRoles {
    /** @param {{userName?:string,permissions?:string[],roles?:string[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    userName;
    /** @type {string[]} */
    permissions;
    /** @type {string[]} */
    roles;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'UnAssignRoles' }
    getMethod() { return 'POST' }
    createResponse() { return new UnAssignRolesResponse() }
}
export class Register {
    /** @param {{userName?:string,firstName?:string,lastName?:string,displayName?:string,email?:string,password?:string,confirmPassword?:string,autoLogin?:boolean,errorView?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init) }
    /** @type {string} */
    userName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    displayName;
    /** @type {string} */
    email;
    /** @type {string} */
    password;
    /** @type {string} */
    confirmPassword;
    /** @type {?boolean} */
    autoLogin;
    /** @type {string} */
    errorView;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'Register' }
    getMethod() { return 'POST' }
    createResponse() { return new RegisterResponse() }
}
export class QueryCustomers extends QueryDb {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
    getTypeName() { return 'QueryCustomers' }
    getMethod() { return 'GET' }
    createResponse() { return new QueryResponse() }
}
export class QuerySubscriptions extends QueryDb {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
    getTypeName() { return 'QuerySubscriptions' }
    getMethod() { return 'GET' }
    createResponse() { return new QueryResponse() }
}
export class QueryOrders extends QueryDb {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
    getTypeName() { return 'QueryOrders' }
    getMethod() { return 'GET' }
    createResponse() { return new QueryResponse() }
}
export class QuerySkus extends QueryDb {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
    getTypeName() { return 'QuerySkus' }
    getMethod() { return 'GET' }
    createResponse() { return new QueryResponse() }
}
export class QueryProducts extends QueryDb {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init) }
    getTypeName() { return 'QueryProducts' }
    getMethod() { return 'GET' }
    createResponse() { return new QueryResponse() }
}

