/**
 * @module MantleClient
 * @description The official NodeJS client for the Mantle App API
 */
/**
 * Error response from Mantle API
 */
interface MantleError {
    /** The error message */
    error: string;
    /** Additional error details */
    details?: string;
}
/**
 * A checklist item for onboarding or feature adoption
 */
interface ChecklistStep {
    /** The ID of the checklist item */
    id: string;
    /** The name of the checklist item */
    name: string;
    /** The description of the checklist item */
    description?: string;
    /** The HTML description of the checklist item */
    descriptionHtml?: string;
    /** The JSON description of the checklist item */
    descriptionJson?: any;
    /** Whether the checklist item is completed */
    completed: boolean;
    /** The URL of the call to action for the checklist item */
    ctaUrl?: string;
    /** The label of the call to action for the checklist item */
    ctaLabel?: string;
    /** The image URL associated with the checklist item */
    imageUrl?: string | null;
    /** The date the checklist item was completed */
    completedAt?: string | null;
    /** Whether the checklist item can be manually completed by the customer */
    allowManualCompletion: boolean;
    /** Whether the checklist item has been skipped */
    skipped: boolean;
    /** The date the checklist item was skipped */
    skippedAt?: string | null;
}
/**
 * A checklist for customer onboarding or feature adoption
 */
interface Checklist {
    /** The ID of the checklist */
    id: string;
    /** The name of the checklist */
    name: string;
    /** The title of the checklist */
    title?: string;
    /** The description of the checklist */
    description?: string;
    /** The HTML description of the checklist */
    descriptionHtml?: string;
    /** The JSON description of the checklist */
    descriptionJson?: any;
    /** The handle of the checklist */
    handle?: string;
    /** The checklist steps */
    steps: ChecklistStep[];
    /** The number of completed steps */
    completedSteps: number;
    /** The total number of steps */
    totalSteps: number;
    /** The percentage of completion for the checklist */
    completionPercentage: number;
    /** Whether the checklist is completed */
    completed: boolean;
    /** The date the checklist was completed */
    completedAt?: string | null;
}
/**
 * Configuration parameters for initializing a new MantleClient
 */
interface MantleClientParams {
    /** The Mantle App ID set up on your app in your Mantle account */
    appId: string;
    /** The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser */
    apiKey?: string;
    /** The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser */
    customerApiToken?: string;
    /** The Mantle API URL to use */
    apiUrl?: string;
}
/**
 * The currently authenticated user of your app
 */
interface Customer {
    /** The ID of the customer */
    id: string;
    /** The name of the customer */
    name?: string;
    /** Whether the customer is a test customer */
    test: boolean;
    /** The customer's preferred currency */
    preferredCurrency?: string;
    /** The platform the customer is on, one of "shopify", "web" or "mantle" */
    platform?: "shopify" | "web" | "mantle";
    /** The ID of the customer on the platform */
    platformId?: string;
    /** The myshopify domain of the customer, if on the Shopify platform */
    myshopifyDomain?: string;
    /** The date the customer was first seen or installed */
    installedAt?: string;
    /** If the customer has or had a trial, the date that it started */
    trialStartsAt?: string;
    /** If the customer has or had a trial, the date that it ended */
    trialExpiresAt?: string;
    /** The plans available to the customer */
    plans: Plan[];
    /** The subscription of the current customer, if any */
    subscription?: Subscription;
    /** The payment method of the current customer, if any */
    paymentMethod?: PaymentMethod;
    /** The features enabled for the current customer */
    features: Record<string, Feature>;
    /** The usage metrics for the current customer */
    usage: Record<string, UsageMetric>;
    /** The custom fields on the customer */
    customFields?: Record<string, any>;
    /** The invoice of the current customer, if the customer is billed via Stripe */
    currentInvoice?: Invoice;
    /** The usage credits of the customer */
    usageCredits: UsageCredit[];
    /** Reviews left by the customer on a platform's app store */
    reviews: Review[];
    /** The current billing status of the customer */
    billingStatus: "none" | "active" | "trialing" | "canceled" | "frozen";
}
/**
 * Various details about a Mantle subscription plan
 */
interface Plan {
    /** The ID of the plan */
    id: string;
    /** The name of the plan */
    name: string;
    /** The description of the plan */
    description?: string;
    /** The availability of the plan, one of "public", "customerTag", "customer", "shopifyPlan" or "hidden" */
    availability: "public" | "customerTag" | "customer" | "shopifyPlan" | "hidden";
    /** The type of the plan, one of "base" or "add_on" */
    type: "base" | "add_on";
    /** The currency code of the plan */
    currencyCode: string;
    /** The presentment amount of the plan */
    presentmentAmount: number;
    /** The presentment currency code of the plan */
    presentmentCurrencyCode: number;
    /** The total amount of the plan, after discounts if applicable */
    total: number;
    /** The subtotal amount of the plan, before discounts if applicable */
    subtotal: number;
    /** @deprecated use subtotal instead */
    amount: number;
    /** Whether the plan is public */
    public: boolean;
    /** Whether the plan is visible to the customer */
    visible: boolean;
    /** Whether the plan is eligible for the customer */
    eligible: boolean;
    /** The number of days in the trial period */
    trialDays: number;
    /** The interval of the plan */
    interval: "EVERY_30_DAYS" | "ANNUAL";
    /** The features of the plan */
    features: Record<string, Feature>;
    /** The order of the features by key */
    featuresOrder: string[];
    /** The usage charges of the plan */
    usageCharges: UsageCharge[];
    /** The capped amount of the usage charge */
    usageChargeCappedAmount?: number;
    /** The custom fields on the plan */
    customFields?: Record<string, any>;
    /** The discounts on the plan */
    discounts: Discount[];
    /** The bundle discounts on the plan */
    bundleDiscounts: BundleDiscount[];
    /** The auto apply discount on the plan, if any */
    autoAppliedDiscount?: Discount;
    /** Whether the plan is part of a flex billing flow */
    flexBilling?: boolean;
    /** The terms of the flex billing plan */
    flexBillingTerms?: string;
    /** The ID of the plan to auto upgrade to */
    autoUpgradeToPlanId?: string;
    /** The base plan in the auto upgrade relationship */
    autoUpgradeBasePlan?: Plan;
    /** The date the plan was created */
    createdAt?: string;
    /** The date the plan was last updated */
    updatedAt?: string;
}
/**
 * The subscription of a customer, containing details about their plan, billing, and features
 */
interface Subscription {
    /** The ID of the subscription */
    id: string;
    /** The plan associated with the subscription */
    plan: Plan;
    /** The line items of the subscription */
    lineItems: SubscriptionLineItem[];
    /** Whether the subscription is active */
    active: boolean;
    /** The date the subscription was activated */
    activatedAt?: string;
    /** The date that the first billing cycle starts or started */
    billingCycleAnchor?: string;
    /** The date that the current billing cycle starts */
    currentPeriodStart?: string;
    /** The date that the current billing cycle ends */
    currentPeriodEnd?: string;
    /** The date that the trial starts */
    trialStartsAt?: string;
    /** The date that the trial ends */
    trialExpiresAt?: string;
    /** The date the subscription will be cancelled */
    cancelOn?: string;
    /** The date the subscription was cancelled */
    cancelledAt?: string;
    /** The date the subscription was frozen */
    frozenAt?: string;
    /** The date the subscription was created */
    createdAt?: string;
    /** The features of the subscription */
    features: Record<string, Feature>;
    /** The order of the features by key */
    featuresOrder: string[];
    /** The usage charges of the subscription */
    usageCharges: UsageCharge[];
    /** The capped amount of the usage charge */
    usageChargeCappedAmount?: number;
    /** The amount of the usage balance used */
    usageBalanceUsed?: number;
    /** Any discount applied to the subscription */
    appliedDiscount?: AppliedDiscount;
    /** The total amount of the plan, after discounts if applicable */
    total: number;
    /** The subtotal amount of the plan, before discounts if applicable */
    subtotal: number;
    /** The presentment total amount of the plan, after discounts if applicable */
    presentmentTotal: number;
    /** The presentment subtotal amount of the plan, before discounts if applicable */
    presentmentSubtotal: number;
    /** The URL to confirm the subscription */
    confirmationUrl?: URL;
    /** The URL to return to after the subscription is complete */
    returnUrl?: URL;
    /** The client secret returned by the billing provider when creating the subscription */
    clientSecret?: string;
    /** The action that can be taken after a subscription is created */
    confirmType?: SubscriptionConfirmType;
}
/**
 * The line items of a subscription
 */
interface SubscriptionLineItem {
    /** The ID of the line item */
    id: string;
    /** The type of the line item */
    type: string;
    /** The amount of the line item */
    amount: number;
    /** The currency code of the line item */
    currencyCode: string;
    /** The presentment amount of the line item */
    presentmentAmount: number;
    /** The presentment currency code of the line item */
    presentmentCurrencyCode: number;
    /** The plan of the line item */
    plan: Plan;
}
/**
 * The payment method of a customer
 */
interface PaymentMethod {
    /** The ID of the payment method */
    id: string;
    /** The type of the payment method */
    type: string;
    /** The brand of the payment method */
    brand: string;
    /** The last 4 digits of the payment method */
    last4: string;
    /** The expiration month of the payment method */
    expMonth: string;
    /** The expiration year of the payment method */
    expYear: string;
}
/**
 * Details about a feature of a plan or subscription
 */
interface Feature {
    /** The ID of the feature */
    id: string;
    /** The name of the feature */
    name: string;
    /** The type of the feature */
    type: "boolean" | "limit" | "limit_with_overage";
    /** The description of the feature */
    description?: string;
    /** The value of the feature */
    value: any;
    /** The display order of the feature */
    displayOrder: number;
}
/**
 * Details about a current user's usage for a particular metric
 */
interface UsageMetric {
    /** The ID of the usage metric */
    id: string;
    /** The name of the usage metric */
    name: string;
    /** The event name of the usage metric */
    eventName: string;
    /** The current value of the usage metric */
    currentValue: number;
    /** The month to date value of the usage metric */
    monthToDateValue?: number;
    /** The last 24 hours value of the usage metric */
    last24HoursValue?: number;
    /** The last 7 days value of the usage metric */
    last7DaysValue?: number;
    /** The last 30 days value of the usage metric */
    last30DaysValue?: number;
    /** The last 90 days value of the usage metric */
    last90DaysValue?: number;
    /** The last 365 days value of the usage metric */
    last365DaysValue?: number;
    /** The all time value of the usage metric */
    allTimeValue?: number;
    /** The usage charge of the usage metric */
    usageCharge?: UsageCharge;
}
/**
 * Details about a usage charge for a plan or subscription
 */
interface UsageCharge {
    /** The ID of the usage charge */
    id: string;
    /** The amount of the usage charge */
    amount: number;
    /** The type of the usage charge */
    type: "unit" | "unit_limits" | "percent";
    /** The terms of the usage charge */
    terms?: string;
    /** The capped amount of the usage charge */
    cappedAmount: number;
    /** The event name of the usage charge */
    eventName?: string;
    /** The limit event name of the usage charge */
    limitEventName?: string;
    /** The limit minimum of the usage charge */
    limitMin?: number;
    /** The limit maximum of the usage charge */
    limitMax?: number;
}
/**
 * The discount applied to a subscription
 */
interface AppliedDiscount {
    /** The ID of the discount */
    id: string;
    /** The price after discount */
    priceAfterDiscount: number;
    /** The discount */
    discount: Discount;
    /** The date the discount ends */
    discountEndsAt?: string;
}
/**
 * Details about a discount for a plan or subscription
 */
interface Discount {
    /** The ID of the discount */
    id: string;
    /** The name of the discount */
    name: string;
    /** The description of the discount */
    description: string;
    /** The amount of the discount */
    amount?: number;
    /** The currency code of the discount amount */
    amountCurrencyCode?: string;
    /** The presentment amount of the discount */
    presentmentAmount?: number;
    /** The presentment currency code of the discount */
    presentmentCurrencyCode?: number;
    /** The percentage of the discount */
    percentage?: number;
    /** The duration limit of the discount in plan intervals */
    durationLimitInIntervals?: number;
    /** The discounted amount of plan after discount */
    discountedAmount: number;
    /** The presentment discounted amount of plan after discount */
    presentmentDiscountedAmount: number;
}
/**
 * Details about a bundle discount for a plan or subscription
 */
interface BundleDiscount {
    /** The ID of the bundle discount */
    id: string;
    /** The amount of the bundle discount */
    amount?: number;
    /** The percentage of the bundle discount */
    percentage?: number;
    /** The duration limit in intervals of the bundle discount */
    durationLimitInIntervals?: number;
    /** The discounted amount for the plan with the discount applied */
    discountedAmount: number;
    /** The type of the bundle discount */
    type: "bundle";
    /** Whether the bundle discount will apply if the customer is subscribed */
    willApplyIfSubscribed: boolean;
    /** The presentment amount of the bundle discount */
    presentmentAmount: number;
    /** The presentment currency code of the bundle discount */
    presentmentCurrencyCode: string;
    /** The presentment discounted amount of the bundle discount */
    presentmentDiscountedAmount: number;
}
/**
 * Details about a usage credit for a customer if one was created for them
 */
interface UsageCredit {
    /** The ID of the usage credit */
    id: string;
    /** The name of the usage credit */
    name: string;
    /** The description of the usage credit */
    description: string;
    /** The original amount of the usage credit */
    amount: number;
    /** The remaining balance of the usage credit */
    balance: number;
    /** The currency code of the usage credit */
    currencyCode: string;
    /** The date the usage credit expires */
    expiresAt?: string;
    /** The date the usage credit was created */
    createdAt?: string;
    /** The date the usage credit was last updated */
    updatedAt?: string;
}
/**
 * A review left by the customer on a platform's app store
 */
interface Review {
    /** The ID of the review */
    id: string;
    /** The platform the review is on */
    type: string;
    /** The rating of the review */
    rating?: number;
    /** The content of the review */
    content?: string;
    /** The date the review was added to the platform */
    date?: string;
}
/**
 * The invoice of a subscription
 */
interface Invoice {
    /** The ID of the invoice */
    id: string;
    /** The start date of the invoice period */
    periodStart: string;
    /** The end date of the invoice period */
    periodEnd: string;
    /** The status of the invoice */
    status: string;
    /** The total amount of the invoice */
    total: number;
    /** The subtotal amount of the invoice */
    subtotal: number;
    /** The amount paid on the invoice */
    amountPaid: number;
    /** The currency code of the invoice */
    currencyCode: string;
    /** Whether the invoice is a test invoice */
    test: boolean;
    /** The ID of the invoice on the billing provider's platform */
    platformId: string;
    /** The URL to the hosted invoice on the billing provider's platform */
    hostedInvoiceUrl?: string;
    /** The invoice on the billing provider's platform */
    platformInvoice?: PlatformInvoice;
    /** The line items of the invoice */
    items: InvoiceLineItem[];
    /** The date the invoice was created */
    createdAt: string;
    /** The date the invoice was last updated */
    updatedAt: string;
}
/**
 * The invoice of a subscription on a billing provider's platform
 */
interface PlatformInvoice {
    /** The ID of the invoice on the billing provider's platform */
    id: string;
    /** The billing provider the invoice is on */
    platform: string;
    /** The number of the invoice */
    number: string;
    /** The date the invoice was created on the billing provider */
    createdAt: string;
}
/**
 * The line items of an invoice
 */
interface InvoiceLineItem {
    /** The ID of the line item */
    id: string;
    /** The type of the line item */
    type: string;
    /** The amount of the line item */
    amount: number;
    /** The currency code of the line item */
    currencyCode: string;
    /** The description of the line item */
    description?: string;
    /** Whether the line item has been paid */
    paid: boolean;
    /** The start date of the invoice period */
    periodStart: string;
    /** The end date of the invoice period */
    periodEnd: string;
    /** Whether the line item is prorated */
    prorated: boolean;
    /** The quantity of the line item */
    quantity: number;
    /** The unit amount of the line item */
    unitAmount: number;
}
/**
 * Response from listing invoices
 */
interface ListInvoicesResponse {
    /** The list of invoices */
    invoices: Invoice[];
    /** Indicates if there are more invoices to fetch */
    hasMore: boolean;
}
/**
 * The model used to send usage events to Mantle
 */
interface UsageEvent {
    /** The ID of the usage event. Will be generated if not provided */
    eventId?: string;
    /** The name of the usage event, which can be tracked by usage metrics */
    eventName: string;
    /** The ID of the Mantle customer */
    customerId: string;
    /** The properties of the usage event */
    properties: Record<string, any>;
}
/**
 * Stripe SetupIntent model, used to collect payment method details for later use
 */
interface SetupIntent {
    /** The ID of the setup intent */
    id: string;
    /** The client secret of the setup intent */
    clientSecret: string;
}
/**
 * The hosted session, used to send the customer to a hosted page to manage their subscription
 */
interface HostedSession {
    /** The ID of the hosted session */
    id: string;
    /** The URL of the hosted session */
    url: string;
}
/**
 * The address of a customer
 */
interface Address {
    /** The first line of the address */
    addressLine1?: string;
    /** The second line of the address */
    addressLine2?: string;
    /** The city of the address */
    city?: string;
    /** The state code of the address, ex. "CA" */
    state?: string;
    /** The postal code of the address */
    postalCode?: string;
    /** The country code of the address, ex. "US" */
    country: string;
    /** The tax ID of the address */
    taxId?: string;
}
/**
 * The contact of a customer
 */
interface Contact {
    /** The label for the type of the contact */
    label: "primary" | "secondary" | "billing" | "technical";
    /** The name of the contact */
    name?: string;
    /** The email of the contact */
    email?: string;
    /** The phone of the contact */
    phone?: string;
}
/**
 * The action that will have to take place after a subscription is initialized.
 * Used by Stripe Billing only.
 */
declare enum SubscriptionConfirmType {
    /**
     * The subscription was created and one of two things will happen:
     * 1. If the subscription has a trial, the first invoice will be paid after the trial ends
     * 2. If the subscription does not have a trial, the first invoice will be paid immediately
     * In both cases, the consumer can either redirect to the `confirmationUrl` provided with the subscription or refetch the customer object
     */
    finalize = "finalize",
    /**
     * The subscription was either upgraded or downgraded and no more action is required.
     * The consumer can either redirect to the `confirmationUrl` provided with the subscription or refetch the customer object
     */
    plan_change = "plan_change",
    /**
     * The subscription was created with a trial and requires a payment method. The consumer should pass the returned `clientSecret` to Stripe Elements in order
     * to collect payment method details and complete the subscription. The consumer should pass the `returnUrl` to the
     * `Stripe#confirmSetup` method to activate the subscription and vault the card. The first invoice will be paid after the trial ends.
     */
    setup = "setup",
    /**
     * The subscription was created without a trial. The consumer should pass the returned `clientSecret` to Stripe Elements in order
     * to collect payment method details and complete the subscription. The consumer should pass the `returnUrl` to the
     * `Stripe#confirmPayment` method to activate the subscription and vault the card. The first invoice will be paid immediately.
     */
    subscribe = "subscribe"
}
/**
 * How to handle subscription creation in the absence of a payment method
 * - `always`: require a payment method if none is attached regardless of whether there is a trial.
 * - `if_required`: require a payment method if none is attached and there is no trial.
 * - `on_upgrade`: require a payment method if none is attached and there is no trial, or if this is an upgrade.
 * - `never`: never require a payment method.
 */
type RequirePaymentMethodOptions = "always" | "if_required" | "on_upgrade" | "never";
/**
 * Parameters for the subscribe method, excluding the plan ID fields which are handled separately
 */
interface SubscribeParams {
    /** The ID of the plan to subscribe to */
    planId?: string;
    /** List of plan IDs to subscribe to */
    planIds?: string[];
    /** The ID of the discount to apply to the subscription */
    discountId?: string;
    /** The URL to redirect to after the subscription is complete */
    returnUrl?: string;
    /** The name of the billing provider to use */
    billingProvider?: string;
    /** The number of days to trial the subscription for */
    trialDays?: number;
    /** Whether to use Stripe checkout for the subscription */
    hosted?: boolean;
    /** Whether to use the saved payment method, defaults to true */
    useSavedPaymentMethod?: boolean;
    /** The collection method to use for the subscription */
    collectionMethod?: string;
    /** The number of days until the subscription is due */
    daysUntilDue?: number;
    /** How to handle subscription creation in the absence of a payment method */
    requirePaymentMethod?: RequirePaymentMethodOptions;
    /** The payment method types to use for the subscription */
    paymentMethodTypes?: string[];
    /** Whether to automatically calculate tax for the subscription, defaults to false */
    automaticTax?: boolean;
    /** Tell the Stripe Checkout Session to require a billing address */
    requireBillingAddress?: boolean;
    /** Prefill the Stripe customer's email address */
    email?: string;
    /** The metadata to attach to the subscription */
    metadata?: Record<string, string>;
}
/**
 * The status of an invoice
 */
type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";
/**
 * Parameters for the listInvoices method
 */
interface ListInvoicesParams {
    /** The page number to get, defaults to 0 */
    page?: number;
    /** The number of invoices to get per page, defaults to 10 */
    limit?: number;
    /** The status of the invoices to get */
    status?: InvoiceStatus;
}
type Notify = {
    id: string;
    title: string;
    body: string;
    cta: {
        type: "url";
        url: string;
        openInNewTab: boolean;
    } | {
        type: "flow";
        flowId: string;
    };
    preview: string;
    createdAt: string;
    updatedAt: string;
};
interface ListNotificationsResponse {
    notifies: Notify[];
    hasMore: boolean;
}
type NotificationTemplate = {
    id: string;
    name: string;
    title: string;
    preview: string;
    body: string;
    deliveryMethod: "flow" | "manual";
};
type IdentifyResponse = {
    apiToken: string;
};
type SuccessResponse = {
    success: boolean;
};
interface ListNotificationTemplatesResponse {
    notificationTemplates: NotificationTemplate[];
    hasMore: boolean;
}
/**
 * Valid platform types for customer identification
 */
type Platform = "shopify" | "web" | "mantle";
/**
 * Base parameters for the identify method
 */
interface BaseIdentifyParams {
    /** The platform the customer is on: "shopify", "web", or "mantle" */
    platform: Platform;
    /** The access token for the platform API, for Shopify apps, this should be the Shop access token */
    accessToken?: string;
    /** The name of the customer */
    name?: string;
    /** The email of the customer */
    email?: string;
    /** The name of the plan on the platform (Shopify plan name) */
    platformPlanName?: string;
    /** Custom fields to store on the customer, must be a JSON object */
    customFields?: Record<string, any>;
    /** Key-value pairs of features to override on the customer */
    features?: Record<string, string>;
    /** The date the customer was created, defaults to now if not provided */
    createdAt?: Date;
    /** True to rotate the customer API token and return the new value */
    rotateApiToken?: boolean;
    /** The tags to apply to the customer. Default operator is "replace" */
    tags?: string[];
    /** The map of fields to operators to use for the query */
    operators?: Record<string, string>;
    /** The address of the customer */
    address?: Address;
    /** The contacts of the customer */
    contacts?: Contact[];
    /** The default billing provider to use for the customer */
    defaultBillingProvider?: string;
    /** The Stripe ID of the customer */
    stripeId?: string;
    /** Indicate whether or not to merge an existing Stripe customer (found with the provided `stripeId`) into a different customer who was matched on `platformId` or `myshopifyDomain` */
    merge?: boolean;
}
/**
 * Parameters specific to Shopify platform identification
 */
type ShopifyIdentifyParams = {
    /** The platform must be "shopify" */
    platform: "shopify";
    /** The unique ID of the customer on the app platform, for Shopify this should be the Shop ID */
    platformId?: string;
    /** The myshopify.com domain of the Shopify store */
    myshopifyDomain?: string;
} & BaseIdentifyParams & ({
    platformId: string;
} | {
    myshopifyDomain: string;
});
/**
 * Parameters for web or mantle platforms
 */
type OtherPlatformIdentifyParams = {
    /** The platform the customer is on ("web" or "mantle") */
    platform: "web" | "mantle";
    /** The unique ID of the customer on the app platform */
    platformId?: string;
    /** The domain of the customer's store */
    myshopifyDomain?: string;
} & BaseIdentifyParams;
type UsageMetricReport = {
    startDate: string;
    endDate: string;
    period: "daily" | "weekly" | "monthly";
    data: {
        date: string;
        value: number;
    }[];
};
declare class MantleClient {
    private appId;
    private apiKey?;
    private customerApiToken?;
    private apiUrl;
    /**
     * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
     * always use the customerApiToken for the customer that is currently authenticated on the frontend.
     */
    constructor({ appId, apiKey, customerApiToken, apiUrl, }: MantleClientParams);
    /**
     * Makes a request to the Mantle API
     * @private
     */
    private mantleRequest;
    /**
     * Evaluates whether a feature is enabled based on its type and value
     * @param feature - The feature to evaluate
     * @param count - The count to evaluate against if the feature is a limit type
     * @returns Whether the feature is considered enabled
     */
    private evaluateFeature;
    /**
     * Identify the customer with Mantle. When platform is "shopify", one of `platformId` or `myshopifyDomain` is required.
     * @param params.platform - The platform the customer is on, defaults to shopify
     * @param params.platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
     * @param params.myshopifyDomain - The myshopify.com domain of the Shopify store
     * @param params.accessToken - The access token for the platform API, for Shopify apps, this should be the Shop access token
     * @param params.name - The name of the customer
     * @param params.email - The email of the customer
     * @param params.platformPlanName - The name of the plan on the platform (Shopify plan name)
     * @param params.customFields - Custom fields to store on the customer, must be a JSON object
     * @param params.features - Key-value pairs of features to override on the customer
     * @param params.createdAt - The date the customer was created, defaults to now if not provided
     * @param params.rotateApiToken - True to rotate the customer API token and return the new value
     * @param params.tags - The tags to apply to the customer. Default operator is "replace"
     * @param params.operators - The map of fields to operators to use for the query
     * @param params.address - The address of the customer
     * @param params.contacts - The contacts of the customer
     * @param params.defaultBillingProvider - The default billing provider to use for the customer
     * @param params.stripeId - The Stripe ID of the customer
     * @param params.merge - Indicate whether or not to merge an existing Stripe customer (found with the provided `stripeId`) into a different customer who was matched on `platformId` or `myshopifyDomain`
     * @returns A promise that resolves to an object with the customer API token or an error
     */
    identify(params: ShopifyIdentifyParams | OtherPlatformIdentifyParams): Promise<IdentifyResponse | MantleError>;
    /**
     * Get the customer associated with the current customer API token
     * @param id - The ID of the customer to get. Only required if using the API key for authentication instead of the customer API token
     * @returns A promise that resolves to the current customer or an error
     */
    getCustomer(id?: string): Promise<Customer | MantleError>;
    /**
     * Check if a feature is enabled for a customer
     * @param params.customerId - The ID of the customer to evaluate the feature for. Only required if using the API key for authentication instead of the customer API token
     * @param params.featureKey - The key of the feature to evaluate
     * @param params.count - The count to evaluate against if the feature is a limit type
     * @returns A promise that resolves to whether the feature is enabled or the limit is less than the count, or an error
     */
    isFeatureEnabled(params: {
        customerId?: string;
        featureKey: string;
        count?: number;
    }): Promise<boolean | MantleError>;
    /**
     * Get the limit for a feature
     * @param params.customerId - The ID of the customer to get the feature limit for. Only required if using the API key for authentication instead of the customer API token
     * @param params.featureKey - The key of the feature to get the limit for
     * @returns A promise that resolves to the limit for the feature. -1 if no customer, no feature, or the feature is not a limit type, or an error
     */
    limitForFeature(params: {
        customerId?: string;
        featureKey: string;
    }): Promise<number | MantleError>;
    /**
     * Subscribe to a plan, or list of plans. Must provide either `planId` or `planIds`
     * @param params.planId - The ID of the plan to subscribe to
     * @param params.planIds - List of plan IDs to subscribe to
     * @param params.discountId - The ID of the discount to apply to the subscription
     * @param params.returnUrl - The URL to redirect to after the subscription is complete
     * @param params.billingProvider - The name of the billing provider to use
     * @param params.trialDays - The number of days to trial the subscription for
     * @param params.hosted - Whether to use Stripe checkout for the subscription
     * @param params.useSavedPaymentMethod - Whether to use the saved payment method
     * @param params.collectionMethod - The collection method to use for the subscription
     * @param params.daysUntilDue - The number of days until the subscription is due
     * @param params.requirePaymentMethod - How to handle subscription creation in the absence of a payment method
     * @param params.paymentMethodTypes - The payment method types to use for the subscription
     * @param params.automaticTax - Whether to automatically calculate tax for the subscription
     * @param params.requireBillingAddress - Tell the Stripe Checkout Session to require a billing address
     * @param params.email - Prefill the Stripe customer's email address
     * @param params.metadata - The metadata to attach to the subscription
     * @returns A promise that resolves to the created subscription or an error
     */
    subscribe(params: ({
        planId: string;
        planIds?: never;
    } & Omit<SubscribeParams, "planId" | "planIds">) | ({
        planId?: never;
        planIds: string[];
    } & Omit<SubscribeParams, "planId" | "planIds">)): Promise<Subscription | MantleError>;
    /**
     * Cancel the current subscription
     * @param params.cancelReason - The reason for cancelling the subscription
     * @returns A promise that resolves to the cancelled subscription or an error
     */
    cancelSubscription(params?: {
        cancelReason?: string;
    }): Promise<Subscription | MantleError>;
    /**
     * Update the subscription
     * @param params.id - The ID of the subscription to update
     * @param params.cappedAmount - The capped amount of the usage charge
     * @returns A promise that resolves to the updated subscription or an error
     */
    updateSubscription(params: {
        id: string;
        cappedAmount: number;
    }): Promise<Subscription | MantleError>;
    /**
     * Send a usage event
     * @param params.eventId - The ID of the event
     * @param params.eventName - The name of the event which can be tracked by usage metrics
     * @param params.timestamp - The timestamp of the event, leave blank to use the current time
     * @param params.customerId - Required if customerApiToken is not used for authentication
     * @param params.properties - The event properties
     * @returns A promise that resolves to true if the event was sent successfully, or an error
     */
    sendUsageEvent(params: {
        eventId?: string;
        eventName: string;
        timestamp?: Date;
        customerId?: string;
        properties?: Record<string, any>;
    }): Promise<SuccessResponse | MantleError>;
    /**
     * Send multiple usage events of the same type in bulk
     * @param params.events - The events to send
     * @returns A promise that resolves to true if the events were sent successfully, or an error
     */
    sendUsageEvents(params: {
        events: UsageEvent[];
    }): Promise<SuccessResponse | MantleError>;
    /**
     * Initial step to start the process of connecting a new payment method from an external billing provider
     * @param params.returnUrl - The URL to redirect to after a checkout has completed
     * @returns A promise that resolves to the created SetupIntent with clientSecret, or an error
     */
    addPaymentMethod(params: {
        returnUrl?: string;
    }): Promise<SetupIntent | MantleError>;
    /**
     * Get report of a usage metric over time intervals
     * @param params.id - The usage metric id
     * @param params.period - The interval to get the report for
     * @param params.customerId - The customer ID to get the report for
     * @returns A promise that resolves to the usage metric report or an error
     */
    getUsageMetricReport(params: {
        id: string;
        period?: string;
        customerId?: string;
    }): Promise<{
        report: UsageMetricReport;
    } | MantleError>;
    /**
     * Get a list of invoices for the current customer
     * @param params.page - The page number to get, defaults to 0
     * @param params.limit - The number of invoices to get per page, defaults to 10
     * @param params.status - The status of the invoices to get
     * @returns A promise that resolves to the list of invoices or an error
     */
    listInvoices(params?: ListInvoicesParams): Promise<ListInvoicesResponse | MantleError>;
    /**
     * Create a hosted session that can be used to send the customer to a hosted page to manage their subscription
     * @param params.type - The type of hosted session to create
     * @param params.config - The configuration for the hosted session
     * @returns A promise that resolves to the hosted session with a url property or an error
     */
    createHostedSession(params: {
        type: string;
        config: Record<string, any>;
    }): Promise<HostedSession | MantleError>;
    /**
     * Send notifications for a specific notification template id
     * @param params.templateId - The ID of the notification template to send
     * @param params.test - Whether to send the notification as a test. If true, the notification will only be sent to the current customer and will have isTest set to true.
     * @returns A promise that resolves to the list of notified customers or an error
     */
    notify(params: {
        templateId: string;
        test?: boolean;
    }): Promise<string[] | MantleError>;
    /**
     * Get list of notifications for the current customer
     * @returns A promise that resolves to the list of notifications or an error
     */
    listNotifications(params?: {
        email?: string;
    }): Promise<ListNotificationsResponse | MantleError>;
    /**
     * Get list of notification templates
     * @returns A promise that resolves to the list of notification templates or an error
     */
    listNotificationTemplates(): Promise<ListNotificationTemplatesResponse | MantleError>;
    /**
     * Trigger a notification CTA for a specific notification id
     * @param params.id - The ID of the notification to trigger the CTA for
     * @returns A promise that resolves to the triggered notification or an error
     */
    triggerNotificationCta(params: {
        id: string;
    }): Promise<SuccessResponse | MantleError>;
    /**
     * Update a notification to set the readAt and dismissedAt dates
     * @param params.id - The ID of the notification to update
     * @param params.readAt - The date the notification was read
     * @param params.dismissedAt - The date the notification was dismissed
     * @returns A promise that resolves if the update was successful or an error
     */
    updateNotification(params: {
        id: string;
        readAt?: Date;
        dismissedAt?: Date;
    }): Promise<SuccessResponse | MantleError>;
    /**
     * Get the activechecklist for the current customer
     * @returns A promise that resolves to the customer's checklist, or null if no checklist is found, or an error
     */
    getChecklist(): Promise<Checklist | null | MantleError>;
    /**
     * Get a list of published checklists for the current customer including checklists after the active checklist
     * @param handle - An optional filter to only return checklists with the given handle(s). Use a CSV string of handles for multiple checklists.
     * @returns A promise that resolves to the customer's checklists, or an error
     */
    getChecklists(handle?: string): Promise<Checklist[] | MantleError>;
    /**
     * Manually complete a checklist step rather than the step's completion trigger: usage event, usage metric, app event, etc.
     * @param params.checklistId - The ID of the checklist to complete the step for
     * @param params.checklistStepId - The ID of the checklist step to complete
     * @returns A promise that resolves if the step was completed successfully or an error
     */
    completeChecklistStep(params: {
        checklistId: string;
        checklistStepId: string;
    }): Promise<SuccessResponse | MantleError>;
    /**
     * Marks the checklist as shown. Doing this when you first show the checklist to the customer will help you more accurately track the customer's progress.
     * @param params.checklistId - The ID of the checklist to show
     * @returns A promise that resolves if the checklist was shown successfully or an error
     */
    showChecklist(params: {
        checklistId: string;
    }): Promise<SuccessResponse | MantleError>;
}

export { type Address, type AppliedDiscount, type Checklist, type ChecklistStep, type Contact, type Customer, type Discount, type Feature, type HostedSession, type IdentifyResponse, type Invoice, type InvoiceLineItem, type ListInvoicesResponse, MantleClient, type MantleError, type Notify, type PaymentMethod, type Plan, type PlatformInvoice, type RequirePaymentMethodOptions, type Review, type SetupIntent, type Subscription, SubscriptionConfirmType, type SuccessResponse, type UsageCharge, type UsageCredit, type UsageEvent, type UsageMetric, type UsageMetricReport };
