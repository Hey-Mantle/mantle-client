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
     * - Whether the subscription is active
     */
    active: boolean;
    /**
     * - The date the subscription was activated
     */
    activatedAt?: string;
    /**
     * - The date the subscription was cancelled
     */
    cancelledAt?: string;
    /**
     * - The date the subscription was frozen
     */
    frozenAt?: string;
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
     * - The date the subscription was created
     */
    createdAt?: string;
    /**
     * - The URL to confirm the subscription
     */
    confirmationUrl?: URL;
    /**
     * - The capped amount of the usage charge
     */
    usageChargeCappedAmount?: number;
    /**
     * - The amount of the usage balance used
     */
    usageBalanceUsed?: number;
    appliedDiscount?: AppliedDiscount;
    /**
     * - The total amount of the plan, after discounts if applicable
     */
    total: number;
    /**
     * - The subtotal amount of the plan, before discounts if applicable
     */
    subtotal: number;
};
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
export type Discount = {
    /**
     * - The ID of the discount
     */
    id: string;
    /**
     * - The amount of the discount
     */
    amount?: number;
    /**
     * - The currency code of the discount amount
     */
    amountCurrencyCode?: string;
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
};
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
     * - The availability of the plan, one of "public", "customerTag", "customer", "shopifyPlan" or "hidden"
     */
    availability: string;
    /**
     * - The currency code of the plan
     */
    currencyCode: string;
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
     * - The date the plan was created
     */
    createdAt?: string;
    /**
     * - The date the plan was last updated
     */
    updatedAt?: string;
};
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
     * - The plans available to the customer
     */
    plans: Array<Plan>;
    /**
     * - The subscription of the current customer, if any
     */
    subscription?: Subscription;
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
     * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
     * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
     * @param {string} [params.apiUrl] - The Mantle API URL to use
     */
    constructor({ appId, apiKey, customerApiToken, apiUrl }: {
        appId: string;
        apiKey: string;
        customerApiToken: string;
        apiUrl?: string;
    });
    appId: string;
    apiKey: string;
    customerApiToken: string;
    apiUrl: string;
    /**
     * Makes a request to the Mantle API
     * @param {Object} params
     * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
     * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
     * @param {JSON} [params.body] - The request body
     * @returns {Promise<JSON>} a promise that resolves to the response body
     */
    mantleRequest({ path, method, body }: {
        path: "customer" | "usage_events" | "subscriptions";
        method: "GET" | "POST" | "PUT" | "DELETE";
        body?: JSON;
    }): Promise<JSON>;
    /**
     * Identify the customer with Mantle. One of `platformId` or `myshopifyDomain` are required.
     * @param {Object} params
     * @param {string} params.platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
     * @param {string} params.myshopifyDomain - The myshopify.com domain of the Shopify store
     * @param {string} [params.platform] - The platform the customer is on, defaults to shopify
     * @param {string} params.accessToken - The access token for the platform API, for Shopify apps, this should be the Shop access token
     * @param {string} params.name - The name of the customer
     * @param {string} params.email - The email of the customer
     * @param {Object.<string, Object>} [params.customFields] - Custom fields to store on the customer, must be a JSON object
     * @returns {Promise<Object.<string, string>} a promise that resolves to an object with the customer API token, `apiToken`
     */
    identify({ platformId, myshopifyDomain, platform, accessToken, name, email, customFields, }: {
        platformId: string;
        myshopifyDomain: string;
        platform?: string;
        accessToken: string;
        name: string;
        email: string;
        customFields?: {
            [x: string]: any;
        };
    }): Promise<{
        [x: string]: string;
    }>;
    /**
     * Get the customer associated with the current customer API token
     * @returns {Promise<Customer>} a promise that resolves to the current customer
     */
    getCustomer(): Promise<Customer>;
    /**
     * Subscribe to a plan, or list of plans. Must provide either `planId` or `planIds`
     * @param {Object} params - The subscription options
     * @param {string} params.planId - The ID of the plan to subscribe to
     * @param {string[]} params.planIds - List of plan IDs to subscribe to
     * @param {string} params.discountId - The ID of the discount to apply to the subscription
     * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
     * @param {string} [params.billingProvider] - The name of the billing provider to use, if none is provided, use sensible default
     * @returns {Promise<Subscription>} a promise that resolves to the created subscription
     */
    subscribe({ planId, planIds, discountId, returnUrl, billingProvider }: {
        planId: string;
        planIds: string[];
        discountId: string;
        returnUrl: string;
        billingProvider?: string;
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
     * @param {string} params.customerId - Required if customerApiToken is not used for authentication. One of either the customer token, Mantle customer ID, platform ID / Shopify Shop ID, Shopify myshopify.com domain
     * @param {Object.<string, any>} params.properties - The event properties
     * @returns {Promise<boolean>} true if the event was sent successfully
     */
    sendUsageEvent({ eventId, eventName, customerId, properties }: {
        eventId?: string;
        eventName: string;
        customerId: string;
        properties: {
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
}
//# sourceMappingURL=index.d.ts.map