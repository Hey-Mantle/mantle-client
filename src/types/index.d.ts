/**
 * - The currently authenticated user of your app
 */
export type Customer = {
    /**
     * - The ID of the customer
     */
    id: string;
    /**
     * - Whether the customer is a test customer
     */
    test: boolean;
    /**
     * - The date the customer was first seen or installed
     */
    installedAt?: Date;
    /**
     * - If the customer has or had a trial, the date that it started
     */
    trialStartsAt?: Date;
    /**
     * - If the customer has or had a trial, the date that it ended
     */
    trialExpiresAt?: Date;
    /**
     * - The plans available to the customer
     */
    plans: Array<Plan>;
    /**
     * - The customer's preferred currency
     */
    preferredCurrency?: string;
    /**
     * - The current billing status of the customer
     */
    billingStatus: "none" | "active" | "trialing" | "canceled" | "frozen";
    /**
     * - The subscription of the current customer, if any
     */
    subscription?: Subscription;
    /**
     * - The payment method of the current customer, if any
     */
    paymentMethod?: PaymentMethod;
    /**
     * - The features enabled for the current customer
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The usage metrics for the current customer
     */
    usage: {
        [x: string]: UsageMetric;
    };
    /**
     * - The custom fields on the customer
     */
    customFields?: {
        [x: string]: any;
    };
    /**
     * - The usage credits of the customer
     */
    usageCredits: Array<UsageCredit>;
    /**
     * - Reviews left by the customer on a platform's app store
     */
    reviews: Array<Review>;
};
/**
 * - The subscription of the current customer, if any
 */
export type Subscription = {
    /**
     * - The ID of the subscription
     */
    id: string;
    /**
     * - The plan of the subscription
     */
    plan: Plan;
    /**
     * - The line items of the subscription
     */
    lineItems: Array<SubscriptionLineItem>;
    /**
     * - Whether the subscription is active
     */
    active: boolean;
    /**
     * - The date the subscription was activated
     */
    activatedAt?: Date;
    /**
     * - The date that the first billing cycle starts or started
     */
    billingCycleAnchor?: Date;
    /**
     * - The date that the current billing cycle starts
     */
    currentPeriodStart?: Date;
    /**
     * - The date that the current billing cycle ends
     */
    currentPeriodEnd?: Date;
    /**
     * - The date that the trial starts
     */
    trialStartsAt?: Date;
    /**
     * - The date that the trial ends
     */
    trialExpiresAt?: Date;
    /**
     * - The date the subscription will be cancelled
     */
    cancelOn?: Date;
    /**
     * - The date the subscription was cancelled
     */
    cancelledAt?: Date;
    /**
     * - The date the subscription was frozen
     */
    frozenAt?: Date;
    /**
     * - The date the subscription was created
     */
    createdAt?: Date;
    /**
     * - The features of the subscription
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The order of the features by key
     */
    featuresOrder: Array<string>;
    /**
     * - The usage charges of the subscription
     */
    usageCharges: Array<UsageCharge>;
    /**
     * - The capped amount of the usage charge
     */
    usageChargeCappedAmount?: number;
    /**
     * - The amount of the usage balance used
     */
    usageBalanceUsed?: number;
    /**
     * - Any discount applied to the subscription
     */
    appliedDiscount?: AppliedDiscount;
    /**
     * - The total amount of the plan, after discounts if applicable
     */
    total: number;
    /**
     * - The subtotal amount of the plan, before discounts if applicable
     */
    subtotal: number;
    /**
     * - The presentment total amount of the plan, after discounts if applicable
     */
    presentmentTotal: number;
    /**
     * - The presentment subtotal amount of the plan, before discounts if applicable
     */
    presentmentSubtotal: number;
    /**
     * - The URL to confirm the subscription
     */
    confirmationUrl?: URL;
    /**
     * - The URL to return to after the subscription is complete
     */
    returnUrl?: URL;
    /**
     * - The client secret returned by the billing provider when creating the subscription
     */
    clientSecret?: string;
    /**
     * - The action that can be taken after a subscription is created
     */
    confirmType?: SubscriptionConfirmType;
};
/**
 * - The line items of a subscription
 */
export type SubscriptionLineItem = {
    /**
     * - The ID of the line item
     */
    id: string;
    /**
     * - The type of the line item
     */
    type: string;
    /**
     * - The amount of the line item
     */
    amount: number;
    /**
     * - The currency code of the line item
     */
    currencyCode: string;
    /**
     * - The presentment amount of the line item
     */
    presentmentAmount: number;
    /**
     * - The presentment currency code of the line item
     */
    presentmentCurrencyCode: number;
    /**
     * - The plan of the line item
     */
    plan: Plan;
};
export type ListInvoicesResponse = {
    /**
     * - The list of invoices
     */
    invoices: Invoice[];
    /**
     * - Indicates if there are more invoices to fetch
     */
    hasMore: boolean;
};
/**
 * - The invoice of a subscription on a billing provider's platform
 */
export type PlatformInvoice = {
    /**
     * - The ID of the invoice on the billing provider's platform
     */
    id: string;
    /**
     * - The billing provider the invoice is on, in this case "stripe" only
     */
    platform: string;
    /**
     * - The number of the invoice
     */
    number: string;
    /**
     * - The date the invoice was created on the billing provider's
     */
    createdAt: string;
};
/**
 * - The invoice of a subscription
 */
export type Invoice = {
    /**
     * - The ID of the invoice
     */
    id: string;
    /**
     * - The start date of the invoice period
     */
    periodStart: string;
    /**
     * - The end date of the invoice period
     */
    periodEnd: string;
    /**
     * - The status of the invoice
     */
    status: string;
    /**
     * - The total amount of the invoice
     */
    total: number;
    /**
     * - The subtotal amount of the invoice
     */
    subtotal: number;
    /**
     * - The amount paid on the invoice
     */
    amountPaid: number;
    /**
     * - The currency code of the invoice
     */
    currencyCode: string;
    /**
     * - Whether the invoice is a test invoice
     */
    test: boolean;
    /**
     * - The ID of the invoice on the billing provider's platform
     */
    platformId: string;
    /**
     * - The URL to the hosted invoice on the billing provider's platform
     */
    hostedInvoiceUrl?: string;
    /**
     * - The invoice on the billing provider's platform
     */
    platformInvoice?: PlatformInvoice;
    /**
     * - The line items of the invoice
     */
    items: InvoiceLineItem[];
    /**
     * - The date the invoice was created
     */
    createdAt: string;
    /**
     * - The date the invoice was last updated
     */
    updatedAt: string;
};
/**
 * - The line items of an invoice
 */
export type InvoiceLineItem = {
    /**
     * - The ID of the line item
     */
    id: string;
    /**
     * - The type of the line item
     */
    type: string;
    /**
     * - The amount of the line item
     */
    amount: number;
    /**
     * - The currency code of the line item
     */
    currencyCode: string;
    /**
     * - The description of the line item
     */
    description?: string;
    /**
     * - Whether the line item has been paid
     */
    paid: boolean;
    /**
     * - The start date of the invoice period
     */
    periodStart: string;
    /**
     * - The end date of the invoice period
     */
    periodEnd: string;
    /**
     * - Whether the line item is prorated
     */
    prorated: boolean;
    /**
     * - The quantity of the line item
     */
    quantity: number;
    /**
     * - The unit amount of the line item
     */
    unitAmount: number;
};
/**
 * - Various details about a Mantle subscription plan
 */
export type Plan = {
    /**
     * - The ID of the plan
     */
    id: string;
    /**
     * - The name of the plan
     */
    name: string;
    /**
     * - The description of the plan
     */
    description?: string;
    /**
     * - The availability of the plan, one of "public", "customerTag", "customer", "shopifyPlan" or "hidden"
     */
    availability: string;
    /**
     * - The type of the plan, one of "base" or "add_on"
     */
    type: "base" | "add_on";
    /**
     * - The currency code of the plan
     */
    currencyCode: string;
    /**
     * - The presentment amount of the plan
     */
    presentmentAmount: number;
    /**
     * - The presentment currency code of the plan
     */
    presentmentCurrencyCode: number;
    /**
     * - The total amount of the plan, after discounts if applicable
     */
    total: number;
    /**
     * - The subtotal amount of the plan, before discounts if applicable
     */
    subtotal: number;
    /**
     * - [Deprecated] use subtotal instead
     */
    amount: number;
    /**
     * - Whether the plan is public
     */
    public: boolean;
    /**
     * - Whether the plan is visible to the customer
     */
    visible: boolean;
    /**
     * - Whether the plan is eligible for the customer
     */
    eligible: boolean;
    /**
     * - The number of days in the trial period
     */
    trialDays: number;
    /**
     * - The interval of the plan
     */
    interval: "EVERY_30_DAYS" | "ANNUAL";
    /**
     * - The features of the plan
     */
    features: {
        [x: string]: Feature;
    };
    /**
     * - The order of the features by key
     */
    featuresOrder: Array<string>;
    /**
     * - The usage charges of the plan
     */
    usageCharges: Array<UsageCharge>;
    /**
     * - The capped amount of the usage charge
     */
    usageChargeCappedAmount?: number;
    /**
     * - The custom fields on the plan
     */
    customFields?: {
        [x: string]: any;
    };
    /**
     * - The discounts on the plan
     */
    discounts: Array<Discount>;
    /**
     * - The auto apply discount on the plan, if any
     */
    autoAppliedDiscount?: Discount;
    /**
     * - Whether the plan is part of a flex billing flow
     */
    flexBilling?: boolean;
    /**
     * - The terms of the flex billing plam
     */
    flexBillingTerms?: string;
    /**
     * - The ID of the plan to auto upgrade to
     */
    autoUpgradeToPlanId?: string;
    /**
     * - The base plan in the auto upgrade relationship
     */
    autoUpgradeBasePlan?: Plan;
    /**
     * - The date the plan was created
     */
    createdAt?: string;
    /**
     * - The date the plan was last updated
     */
    updatedAt?: string;
};
/**
 * - The payment method of the current customer, if any
 */
export type PaymentMethod = {
    /**
     * - The ID of the payment method
     */
    id: string;
    /**
     * - The type of the payment method
     */
    type: string;
    /**
     * - The brand of the payment method
     */
    brand: string;
    /**
     * - The last 4 digits of the payment method
     */
    last4: string;
    /**
     * - The expiration month of the payment method
     */
    expMonth: string;
    /**
     * - The expiration year of the payment method
     */
    expYear: string;
};
/**
 * - Details about a current user's usage for a particular metric
 */
export type UsageMetric = {
    /**
     * - The ID of the usage metric
     */
    id: string;
    /**
     * - The name of the usage metric
     */
    name: string;
    /**
     * - The description of the usage metric
     */
    eventName: string;
    /**
     * - The current value of the usage metric
     */
    currentValue: number;
    /**
     * - The month to date value of the usage metric
     */
    monthToDateValue?: number;
    /**
     * - The last 24 hours value of the usage metric
     */
    last24HoursValue?: number;
    /**
     * - The last 7 days value of the usage metric
     */
    last7DaysValue?: number;
    /**
     * - The last 30 days value of the usage metric
     */
    last30DaysValue?: number;
    /**
     * - The last 90 days value of the usage metric
     */
    last90DaysValue?: number;
    /**
     * - The last 365 days value of the usage metric
     */
    last365DaysValue?: number;
    /**
     * - The all time value of the usage metric
     */
    allTimeValue?: number;
    /**
     * - The usage charge of the usage metric
     */
    usageCharge?: UsageCharge;
};
/**
 * - Details about a feature of a plan or subscription
 */
export type Feature = {
    /**
     * - The ID of the feature
     */
    id: string;
    /**
     * - The name of the feature
     */
    name: string;
    /**
     * - The description of the feature
     */
    type: "boolean" | "limit" | "limit_with_overage";
    /**
     * - The description of the feature
     */
    description?: string;
    /**
     * - The value of the feature
     */
    value: any;
    /**
     * - The display order of the feature
     */
    displayOrder: number;
};
/**
 * - The discount applied to a subscription
 */
export type AppliedDiscount = {
    /**
     * - The ID of the discount
     */
    id: string;
    /**
     * - The price after discount
     */
    priceAfterDiscount: number;
    /**
     * - The discount
     */
    discount: Discount;
    /**
     * - The date the discount ends
     */
    discountEndsAt?: string;
};
/**
 * - Details about a usage charge for a plan or subscription
 */
export type UsageCharge = {
    /**
     * - The ID of the usage charge
     */
    id: string;
    /**
     * - The amount of the usage charge
     */
    amount: number;
    /**
     * - The type of the usage charge
     */
    type: "unit" | "unit_limits" | "percent";
    /**
     * - The terms of the usage charge
     */
    terms?: string;
    /**
     * - The capped amount of the usage charge
     */
    cappedAmount: number;
    /**
     * - The event name of the usage charge
     */
    eventName?: string;
    /**
     * - The limit event name of the usage charge
     */
    limitEventName?: string;
    /**
     * - The limit minimum of the usage charge
     */
    limitMin?: number;
    /**
     * - The limit maximum of the usage charge
     */
    limitMax?: number;
};
/**
 * - Details about a usage credit for a customer if one was created for them
 */
export type UsageCredit = {
    /**
     * - The ID of the usage credit
     */
    id: string;
    /**
     * - The name of the usage credit
     */
    name: string;
    /**
     * - The description of the usage credit
     */
    description: string;
    /**
     * - The original amount of the usage credit
     */
    amount: number;
    /**
     * - The remaining balance of the usage credit
     */
    balance: number;
    /**
     * - The currency code of the usage credit
     */
    currencyCode: string;
    /**
     * - The date the usage credit expires
     */
    expiresAt?: Date;
    /**
     * - The date the usage credit was created
     */
    createdAt?: Date;
    /**
     * - The date the usage credit was last updated
     */
    updatedAt?: Date;
};
/**
 * - The model used to send usage events to Mantle. Useful for tracking usage metrics and doing metered billing
 */
export type UsageEvent = {
    /**
     * - The ID of the usage event. Will be generated if not provided
     */
    eventId?: string;
    /**
     * - The name of the usage event, which can be tracked by usage metrics
     */
    eventName: string;
    /**
     * - The ID of the Mantle customer
     */
    customerId: string;
    /**
     * - The properties of the usage event
     */
    properties: {
        [x: string]: any;
    };
};
/**
 * - Details about a discount for a plan or subscription
 */
export type Discount = {
    /**
     * - The ID of the discount
     */
    id: string;
    /**
     * - The name of the discount
     */
    name: string;
    /**
     * - The description of the discount
     */
    description: string;
    /**
     * - The amount of the discount
     */
    amount?: number;
    /**
     * - The currency code of the discount amount
     */
    amountCurrencyCode?: string;
    /**
     * - The presentment amount of the discount
     */
    presentmentAmount?: number;
    /**
     * - The presentment currency code of the discount
     */
    presentmentCurrencyCode?: number;
    /**
     * - The percentage of the discount
     */
    percentage?: number;
    /**
     * - The duration limit of the discount in plan intervals
     */
    durationLimitInIntervals?: number;
    /**
     * - The discounted amount of plan after discount
     */
    discountedAmount: number;
    /**
     * - The presentment discounted amount of plan after discount
     */
    presentmentDiscountedAmount: number;
};
/**
 * - Stripe SetupIntent model, used to collect payment method details for later use
 */
export type SetupIntent = {
    /**
     * - The ID of the setup intent
     */
    id: string;
    /**
     * - The client secret of the setup intent
     */
    clientSecret: string;
};
/**
 * - The hosted session, used to send the customer to a hosted page to manage their subscription
 */
export type HostedSession = {
    /**
     * - The ID of the hosted session
     */
    id: string;
    /**
     * - The URL of the hosted session
     */
    url: string;
};
/**
 * - The address of a customer
 */
export type Address = {
    /**
     * - The first line of the address
     */
    addressLine1?: string;
    /**
     * - The second line of the address
     */
    addressLine2?: string;
    /**
     * - The city of the address
     */
    city?: string;
    /**
     * - The state code of the address, ex. "CA"
     */
    state?: string;
    /**
     * - The postal code of the address
     */
    postalCode?: string;
    /**
     * - The country code of the address, ex. "US"
     */
    country: string;
    /**
     * - The tax ID of the address
     */
    taxId?: string;
};
/**
 * - The contact of a customer
 */
export type Contact = {
    /**
     * - The label for the type of the contact
     */
    label: "primary" | "secondary" | "billing" | "technical";
    /**
     * - The name of the contact
     */
    name?: string;
    /**
     * - The email of the contact
     */
    email?: string;
    /**
     * - The phone of the contact
     */
    phone?: string;
};
/**
 * - The review left by the customer on a platform's app store
 */
export type Review = {
    /**
     * - The ID of the review
     */
    id: string;
    /**
     * - The platform the review is on, e.g. "shopify"
     */
    type: string;
    /**
     * - The rating of the review
     */
    rating?: number;
    /**
     * - The content of the review
     */
    content?: string;
    /**
     * - The date the review was added to the platform
     */
    date?: Date;
};
/**
 * @module MantleClient
 * @description The official NodeJS client for the Mantle App API
 */
export class MantleClient {
    /**
     * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
     * always use the customerApiToken for the customer that is currently authenticated on the frontend.
     * @param {Object} params
     * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
     * @param {string} [params.apiKey] - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
     * @param {string} [params.customerApiToken] - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
     * @param {string} [params.apiUrl] - The Mantle API URL to use
     */
    constructor({ appId, apiKey, customerApiToken, apiUrl }: {
        appId: string;
        apiKey?: string;
        customerApiToken?: string;
        apiUrl?: string;
    });
    appId: string;
    apiKey: string;
    customerApiToken: string;
    apiUrl: string;
    /**
     * Makes a request to the Mantle API
     * @param {Object} params
     * @param {"customer"|"usage_events"|"subscriptions"|"payment_methods"|"identify"} params.path - The path to the API endpoint
     * @param {"GET"|"POST"|"PUT"|"DELETE"} [params.method] - The HTTP method to use. Defaults to GET
     * @param {JSON} [params.body] - The request body
     * @returns {Promise<JSON>} a promise that resolves to the response body
     */
    mantleRequest({ path, method, body }: {
        path: "customer" | "usage_events" | "subscriptions" | "payment_methods" | "identify";
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: JSON;
    }): Promise<JSON>;
    /**
     * Identify the customer with Mantle. One of `platformId` or `myshopifyDomain` are required.
     * @param {Object} params
     * @param {string} [params.platformId] - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
     * @param {string} [params.myshopifyDomain] - The myshopify.com domain of the Shopify store
     * @param {string} [params.platform] - The platform the customer is on, defaults to shopify
     * @param {string} [params.accessToken] - The access token for the platform API, for Shopify apps, this should be the Shop access token
     * @param {string} [params.name] - The name of the customer
     * @param {string} [params.email] - The email of the customer
     * @param {string} [params.platformPlanName] - The name of the plan on the platform (Shopify plan name)
     * @param {Object.<string, Object>} [params.customFields] - Custom fields to store on the customer, must be a JSON object
     * @param {Object.<string, string>} [params.features] - Key-value pairs of features to override on the customer. Normally features are automatically set based on the customer's subscription, but this allows you to override them.
     * @param {Date} [params.createdAt] - The date the customer was created, defaults to now if not provided
     * @param {boolean} [params.rotateApiToken] - True to rotate the customer API token and return the new value
     * @param {string[]} [params.tags] - The tags to apply to the customer. Default operator is "replace"
     * @param {Object.<string, string>} [params.operators] - The map of fields to operators to use for the query, such as { tags: "append" }. Possibly values are "append", "remove", "replace"
     * @param {Address} [params.address] - The address of the customer
     * @param {Array.<Contact>} [params.contacts] - The contacts of the customer
     * @param {string} [params.defaultBillingProvider] - The default billing provider to use for the customer, if none is provided, use platform default
     * @param {string} [params.stripeId] - The Stripe ID of the customer if using Stripe as a billing provider
     * @param {string} [params.billingProviderId] - The ID of the customer on the external billing provider, if applicable
     * @returns {Promise<Object.<string, string>} a promise that resolves to an object with the customer API token, `apiToken`
     */
    identify({ platformId, myshopifyDomain, platform, accessToken, name, email, platformPlanName, customFields, features, createdAt, rotateApiToken, tags, operators, address, contacts, defaultBillingProvider, }: {
        platformId?: string;
        myshopifyDomain?: string;
        platform?: string;
        accessToken?: string;
        name?: string;
        email?: string;
        platformPlanName?: string;
        customFields?: {
            [x: string]: any;
        };
        features?: {
            [x: string]: string;
        };
        createdAt?: Date;
        rotateApiToken?: boolean;
        tags?: string[];
        operators?: {
            [x: string]: string;
        };
        address?: Address;
        contacts?: Array<Contact>;
        defaultBillingProvider?: string;
        stripeId?: string;
        billingProviderId?: string;
    }): Promise<{
        [x: string]: string;
    }>;
    /**
     * Get the customer associated with the current customer API token
     * @param {string} [id] - The ID of the customer to get. Only required if using the API key for authentication instead of the customer API token
     * @returns {Promise<Customer>} a promise that resolves to the current customer
     */
    getCustomer(id?: string): Promise<Customer>;
    /**
     * Subscribe to a plan, or list of plans. Must provide either `planId` or `planIds`
     * @param {Object} params - The subscription options
     * @param {string} [params.planId] - The ID of the plan to subscribe to
     * @param {string[]} [params.planIds] - List of plan IDs to subscribe to
     * @param {string} [params.discountId] - The ID of the discount to apply to the subscription
     * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
     * @param {string} [params.billingProvider] - The name of the billing provider to use, if none is provided, use sensible default
     * @param {boolean} [params.useSavedPaymentMethod] - Whether to use the saved payment method for the subscription if available
     * @param {number} [params.trialDays] - The number of days to trial the subscription for
     * @param {boolean} [params.hosted] - Whether or not to use Stripe checkout for the subscription. Not applicable for Shopify subscriptions as they are always hosted. Defaults to true
     * @param {boolean} [params.requireBillingAddress] - (Stripe checkout only) Tell the Stripe Checkout Session to require a billing address. Defaults to false.
     * @param {string} [params.email] - (Stripe checkout only) Prefill the Stripe customer's email address. Defaults to null.
     * @param {Object.<string, string>} [params.metadata] - (Stripe checkout only) The metadata to attach to the subscription. Key-value pairs of metadata to attach to the subscription. Defaults to null.
     * @returns {Promise<Subscription>} a promise that resolves to the created subscription
     */
    subscribe({ planId, planIds, discountId, returnUrl, billingProvider, useSavedPaymentMethod, trialDays, hosted, }: {
        planId?: string;
        planIds?: string[];
        discountId?: string;
        returnUrl: string;
        billingProvider?: string;
        useSavedPaymentMethod?: boolean;
        trialDays?: number;
        hosted?: boolean;
        requireBillingAddress?: boolean;
        email?: string;
        metadata?: {
            [x: string]: string;
        };
    }): Promise<Subscription>;
    /**
     * Cancel the current subscription
     * @param {Object} params - The subscription options
     * @param {string} [params.cancelReason] - The reason for cancelling the subscription
     * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
     */
    cancelSubscription({ cancelReason }?: {
        cancelReason?: string;
    }): Promise<Subscription>;
    /**
     * Update the subscription
     * @param {Object} params - The subscription options
     * @param {string} params.id - The ID of the subscription to update
     * @param {number} params.cappedAmount - The capped amount of the usage charge
     * @returns {Promise<Subscription>} a promise that resolves to the updated subscription
     */
    updateSubscription({ id, cappedAmount }: {
        id: string;
        cappedAmount: number;
    }): Promise<Subscription>;
    /**
     * Send a usage event
     * @param {Object} params - The usage event options
     * @param {string} [params.eventId] - The ID of the event
     * @param {string} params.eventName - The name of the event which can be tracked by usage metrics
     * @param {Date} params.timestamp - The timestamp of the event, leave blank to use the current time
     * @param {string} [params.customerId] - Required if customerApiToken is not used for authentication. One of either:
     *                                       - Mantle customer ID returned by the /customer endpoint
     *                                       - platformId used to identify the customer on the platform
     *                                       - Shopify shopId or myshopifyDomain
     * @param {Object.<string, any>} [params.properties] - The event properties
     * @returns {Promise<boolean>} true if the event was sent successfully
     */
    sendUsageEvent({ eventId, eventName, timestamp, customerId, properties }: {
        eventId?: string;
        eventName: string;
        timestamp: Date;
        customerId?: string;
        properties?: {
            [x: string]: any;
        };
    }): Promise<boolean>;
    /**
     * Send multiple usage events of the same type in bulk, for example, when tracking page views
     * @param {Object} params - The usage event options
     * @param {UsageEvent[]} params.events - The events to send
     * @returns {Promise<boolean>} true if the events were sent successfully
     */
    sendUsageEvents({ events }: {
        events: UsageEvent[];
    }): Promise<boolean>;
    /**
     * Initial step to start the process of connecting a new payment method from an external billing provider.
     * For Stripe billing, this creates a `SetupIntent` which contains a `clientSecret`, which can be used to initialize
     * Stripe Elements or Stripe Checkout, which is necessary to collect payment method details to save for later use,
     * or complete checkout without an active `PaymentIntent`. Do not store this `clientSecret` or share it with anyone,
     * except for as part of the client-side payment method collection process.
     * @param {Object} params
     * @param {string} params.returnUrl - The URL to redirect to after a checkout has completed
     * @returns {Promise<SetupIntent>} a promise that resolves to the created `SetupIntent` with `clientSecret`
     */
    addPaymentMethod({ returnUrl }: {
        returnUrl: string;
    }): Promise<SetupIntent>;
    /**
     * Get report of a usage metric over time intervals
     * @param {Object} id - The usage metric id
     * @param {string} [period] - The interval to get the report for, one of "daily", "weekly", "monthly"
     * @returns {Promise<Object>} a promise that resolves to the usage metric report
     */
    getUsageMetricReport({ id, period, customerId }: any): Promise<any>;
    /**
     * Get a list of invoices for the current customer.
     * If no parameters are provided, defaults to returning the first 10 invoices.
     * Currently only supports invoices generated by Stripe.
     * @param {Object} [params={}] - Options for pagination
     * @param {number} [params.page=0] - The page number to get, defaults to 0
     * @param {number} [params.limit=10] - The number of invoices to get per page, defaults to 10
     * @returns {Promise<ListInvoicesResponse>} a promise that resolves to the list of invoices
     */
    listInvoices({ page, limit }?: {
        page?: number;
        limit?: number;
    }): Promise<ListInvoicesResponse>;
    /**
     * Create a hosted session that can be used to send the customer to a hosted page to manage their subscription
     * @param {Object} params - The hosted session options
     * @param {string} params.type - The type of hosted session to create, one of "plans" or "account"
     * @param {Object} params.config - The configuration for the hosted session
     * @returns {Promise<HostedSession>} a promise that resolves to the hosted session with a url property
     */
    createHostedSession(params: {
        type: string;
        config: any;
    }): Promise<HostedSession>;
}
/**
 * SubscriptionConfirmType - The action that will have to take place after a subscription is initialized
 */
export type SubscriptionConfirmType = string;
export namespace SubscriptionConfirmType {
    let finalize: string;
    let setup: string;
    let subscribe: string;
}
//# sourceMappingURL=index.d.ts.map