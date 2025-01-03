/**
 * @module MantleClient
 * @description The official NodeJS client for the Mantle App API
 */
class MantleClient {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
   * always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} [params.apiKey] - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
   * @param {string} [params.customerApiToken] - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
   * @param {string} [params.apiUrl] - The Mantle API URL to use
   */
  constructor({ appId, apiKey, customerApiToken, apiUrl = "https://appapi.heymantle.com/v1" }) {
    if (!appId) {
      throw new Error("MantleClient appId is required");
    }
    if (typeof window !== "undefined" && apiKey) {
      throw new Error("MantleClient apiKey should never be used in the browser");
    }

    this.appId = appId;
    this.apiKey = apiKey;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

  /**
   * Makes a request to the Mantle API
   * @param {Object} params
   * @param {"customer"|"usage_events"|"subscriptions"|"payment_methods"|"identify"} params.path - The path to the API endpoint
   * @param {"GET"|"POST"|"PUT"|"DELETE"} [params.method] - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path, method = "GET", body }) {
    try {
      const url = `${this.apiUrl}${path.startsWith("/") ? "" : "/"}${path}${
        body && method === "GET" ? `?${new URLSearchParams(body)}` : ""
      }`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...(this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {}),
          ...(this.customerApiToken
            ? { "X-Mantle-Customer-Api-Token": this.customerApiToken }
            : {}),
        },
        ...(body &&
          method !== "GET" && {
            body: JSON.stringify(body),
          }),
      });
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(`[mantleRequest] ${path} error: ${e.message}`);
      throw e;
    }
  }

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
  async identify({
    platformId,
    myshopifyDomain,
    platform = "shopify",
    accessToken,
    name,
    email,
    platformPlanName,
    customFields,
    features,
    createdAt,
    rotateApiToken,
    tags,
    operators,
    address,
    contacts,
    defaultBillingProvider,
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: {
        platformId,
        myshopifyDomain,
        platform,
        accessToken,
        name,
        email,
        platformPlanName,
        customFields,
        features,
        createdAt,
        rotateApiToken,
        tags,
        operators,
        address,
        contacts,
        defaultBillingProvider,
      },
    });
  }

  /**
   * Get the customer associated with the current customer API token
   * @param {string} [id] - The ID of the customer to get. Only required if using the API key for authentication instead of the customer API token
   * @returns {Promise<Customer>} a promise that resolves to the current customer
   */
  async getCustomer(id) {
    return (
      await this.mantleRequest({
        path: "customer",
        ...(id ? { body: { id } } : {}),
      })
    ).customer;
  }

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
  async subscribe({
    planId,
    planIds,
    discountId,
    returnUrl,
    billingProvider,
    useSavedPaymentMethod = false,
    trialDays,
    hosted = true,
  }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: {
        planId,
        planIds,
        discountId,
        returnUrl,
        billingProvider,
        useSavedPaymentMethod,
        trialDays,
        hosted,
      },
    });
  }

  /**
   * Cancel the current subscription
   * @param {Object} params - The subscription options
   * @param {string} [params.cancelReason] - The reason for cancelling the subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription({ cancelReason } = {}) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "DELETE",
      ...(cancelReason && {
        body: { cancelReason },
      }),
    });
  }

  /**
   * Update the subscription
   * @param {Object} params - The subscription options
   * @param {string} params.id - The ID of the subscription to update
   * @param {number} params.cappedAmount - The capped amount of the usage charge
   * @returns {Promise<Subscription>} a promise that resolves to the updated subscription
   */
  async updateSubscription({ id, cappedAmount }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "PUT",
      body: { id, cappedAmount },
    });
  }

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
  async sendUsageEvent({ eventId, eventName, timestamp, customerId, properties = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId,
        eventName,
        timestamp,
        ...(customerId ? { customerId } : {}),
        properties,
      },
    });
  }

  /**
   * Send multiple usage events of the same type in bulk, for example, when tracking page views
   * @param {Object} params - The usage event options
   * @param {UsageEvent[]} params.events - The events to send
   * @returns {Promise<boolean>} true if the events were sent successfully
   */
  async sendUsageEvents({ events }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        events,
      },
    });
  }

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
  async addPaymentMethod({ returnUrl }) {
    return await this.mantleRequest({
      path: "payment_methods",
      method: "POST",
      ...(returnUrl && {
        body: { returnUrl },
      }),
    });
  }

  /**
   * Get report of a usage metric over time intervals
   * @param {Object} id - The usage metric id
   * @param {string} [period] - The interval to get the report for, one of "daily", "weekly", "monthly"
   * @returns {Promise<Object>} a promise that resolves to the usage metric report
   */
  async getUsageMetricReport({ id, period, customerId }) {
    return await this.mantleRequest({
      path: `usage_events/${id}/report`,
      body: {
        ...(period ? { period } : {}),
        ...(customerId ? { customerId } : {}),
      },
    });
  }

  /**
   * Get a list of invoices for the current customer.
   * If no parameters are provided, defaults to returning the first 10 invoices.
   * Currently only supports invoices generated by Stripe.
   * @param {Object} [params={}] - Options for pagination
   * @param {number} [params.page=0] - The page number to get, defaults to 0
   * @param {number} [params.limit=10] - The number of invoices to get per page, defaults to 10
   * @returns {Promise<ListInvoicesResponse>} a promise that resolves to the list of invoices
   */
  async listInvoices({ page = 0, limit = 10 } = {}) {
    return await this.mantleRequest({
      path: "invoices",
      body: {
        page,
        limit,
      },
    });
  }

  /**
   * Create a hosted session that can be used to send the customer to a hosted page to manage their subscription
   * @param {Object} params - The hosted session options
   * @param {string} params.type - The type of hosted session to create, one of "plans" or "account"
   * @param {Object} params.config - The configuration for the hosted session
   * @returns {Promise<HostedSession>} a promise that resolves to the hosted session with a url property
   */
  async createHostedSession(params) {
    const { type, config } = params;
    const response = await this.mantleRequest({
      path: "hosted_sessions",
      method: "POST",
      body: {
        type,
        config,
      },
    });
    return {
      ...(response?.session || {}),
      ...(response?.error || { error: response.error }),
    };
  }
}

/**
 * @typedef Customer - The currently authenticated user of your app
 * @property {string} id - The ID of the customer
 * @property {boolean} test - Whether the customer is a test customer
 * @property {Date} [installedAt] - The date the customer was first seen or installed
 * @property {Date} [trialStartsAt] - If the customer has or had a trial, the date that it started
 * @property {Date} [trialExpiresAt] - If the customer has or had a trial, the date that it ended
 * @property {Array.<Plan>} plans - The plans available to the customer
 * @property {string} [preferredCurrency] - The customer's preferred currency
 * @property {"none"|"active"|"trialing"|"canceled"|"frozen"} billingStatus - The current billing status of the customer
 * @property {Subscription} [subscription] - The subscription of the current customer, if any
 * @property {PaymentMethod} [paymentMethod] - The payment method of the current customer, if any
 * @property {Object.<string, Feature>} features - The features enabled for the current customer
 * @property {Object.<string, UsageMetric>} usage - The usage metrics for the current customer
 * @property {Object.<string, Object>} [customFields] - The custom fields on the customer
 * @property {Array.<UsageCredit>} usageCredits - The usage credits of the customer
 * @property {Array.<Review>} reviews - Reviews left by the customer on a platform's app store
 */

/**
 * @readonly
 * @enum {string} SubscriptionConfirmType - The action that will have to take place after a subscription is initialized
 */
const SubscriptionConfirmType = {
  /**
   * The subscription was created and one of two things will happen:
   * 1. If the subscription has a trial, the first invoice will be paid after the trial ends
   * 2. If the subscription does not have a trial, the first invoice will be paid immediately
   * In both cases, the consumer should redirect to the `returnUrl` provided with the subscription to activate the subscription
   * @type {string}
   */
  finalize: "finalize",

  /**
   * The subscription was created with a trial. The consumer should pass the returned `clientSecret` to Stripe Elements in order
   * to collect payment method details and complete the subscription. The consumer should pass the `returnUrl` to the
   * `Stripe#confirmSetup` method to activate the subscription and vault the card. The first invoice will be paid after the trial ends.
   * @type {string}
   */
  setup: "setup",

  /**
   * The subscription was created without a trial. The consumer should pass the returned `clientSecret` to Stripe Elements in order
   * to collect payment method details and complete the subscription. The consumer should pass the `returnUrl` to the
   * `Stripe#confirmPayment` method to activate the subscription and vault the card. The first invoice will be paid immediately.
   */
  subscribe: "subscribe",
};

/**
 * @typedef Subscription - The subscription of the current customer, if any
 * @property {string} id - The ID of the subscription
 * @property {Plan} plan - The plan of the subscription
 * @property {Array.<SubscriptionLineItem>} lineItems - The line items of the subscription
 * @property {boolean} active - Whether the subscription is active
 * @property {Date} [activatedAt] - The date the subscription was activated
 * @property {Date} [billingCycleAnchor] - The date that the first billing cycle starts or started
 * @property {Date} [currentPeriodStart] - The date that the current billing cycle starts
 * @property {Date} [currentPeriodEnd] - The date that the current billing cycle ends
 * @property {Date} [trialStartsAt] - The date that the trial starts
 * @property {Date} [trialExpiresAt] - The date that the trial ends
 * @property {Date} [cancelOn] - The date the subscription will be cancelled
 * @property {Date} [cancelledAt] - The date the subscription was cancelled
 * @property {Date} [frozenAt] - The date the subscription was frozen
 * @property {Date} [createdAt] - The date the subscription was created
 * @property {Object.<string, Feature>} features - The features of the subscription
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the subscription
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {number} [usageBalanceUsed] - The amount of the usage balance used
 * @property {AppliedDiscount} [appliedDiscount] - Any discount applied to the subscription
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 * @property {number} presentmentTotal - The presentment total amount of the plan, after discounts if applicable
 * @property {number} presentmentSubtotal - The presentment subtotal amount of the plan, before discounts if applicable
 * @property {URL} [confirmationUrl] - The URL to confirm the subscription
 * @property {URL} [returnUrl] - The URL to return to after the subscription is complete
 * @property {string} [clientSecret] - The client secret returned by the billing provider when creating the subscription
 * @property {SubscriptionConfirmType} [confirmType] - The action that can be taken after a subscription is created
 */

/**
 * @typedef SubscriptionLineItem - The line items of a subscription
 * @property {string} id - The ID of the line item
 * @property {string} type - The type of the line item
 * @property {number} amount - The amount of the line item
 * @property {string} currencyCode - The currency code of the line item
 * @property {number} presentmentAmount - The presentment amount of the line item
 * @property {number} presentmentCurrencyCode - The presentment currency code of the line item
 * @property {Plan} plan - The plan of the line item
 */

/**
 * @typedef ListInvoicesResponse
 * @property {Invoice[]} invoices - The list of invoices
 * @property {boolean} hasMore - Indicates if there are more invoices to fetch
 */

/**
 * @typedef PlatformInvoice - The invoice of a subscription on a billing provider's platform
 * @property {string} id - The ID of the invoice on the billing provider's platform
 * @property {string} platform - The billing provider the invoice is on, in this case "stripe" only
 * @property {string} number - The number of the invoice
 * @property {string} createdAt - The date the invoice was created on the billing provider's
 */

/**
 * @typedef Invoice - The invoice of a subscription
 * @property {string} id - The ID of the invoice
 * @property {string} periodStart - The start date of the invoice period
 * @property {string} periodEnd - The end date of the invoice period
 * @property {string} status - The status of the invoice
 * @property {number} total - The total amount of the invoice
 * @property {number} subtotal - The subtotal amount of the invoice
 * @property {number} amountPaid - The amount paid on the invoice
 * @property {string} currencyCode - The currency code of the invoice
 * @property {boolean} test - Whether the invoice is a test invoice
 * @property {string} platformId - The ID of the invoice on the billing provider's platform
 * @property {string} [hostedInvoiceUrl] - The URL to the hosted invoice on the billing provider's platform
 * @property {PlatformInvoice} [platformInvoice] - The invoice on the billing provider's platform
 * @property {InvoiceLineItem[]} items - The line items of the invoice
 * @property {string} createdAt - The date the invoice was created
 * @property {string} updatedAt - The date the invoice was last updated
 */

/**
 * @typedef InvoiceLineItem - The line items of an invoice
 * @property {string} id - The ID of the line item
 * @property {string} type - The type of the line item
 * @property {number} amount - The amount of the line item
 * @property {string} currencyCode - The currency code of the line item
 * @property {string} [description] - The description of the line item
 * @property {boolean} paid - Whether the line item has been paid
 * @property {string} periodStart - The start date of the invoice period
 * @property {string} periodEnd - The end date of the invoice period
 * @property {boolean} prorated - Whether the line item is prorated
 * @property {number} quantity - The quantity of the line item
 * @property {number} unitAmount - The unit amount of the line item
 */

/**
 * @typedef Plan - Various details about a Mantle subscription plan
 * @property {string} id - The ID of the plan
 * @property {string} name - The name of the plan
 * @property {string} [description] - The description of the plan
 * @property {string} availability - The availability of the plan, one of "public", "customerTag", "customer", "shopifyPlan" or "hidden"
 * @property {"base"|"add_on"} type - The type of the plan, one of "base" or "add_on"
 * @property {string} currencyCode - The currency code of the plan
 * @property {number} presentmentAmount - The presentment amount of the plan
 * @property {number} presentmentCurrencyCode - The presentment currency code of the plan
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 * @property {number} amount - [Deprecated] use subtotal instead
 * @property {boolean} public - Whether the plan is public
 * @property {boolean} visible - Whether the plan is visible to the customer
 * @property {boolean} eligible - Whether the plan is eligible for the customer
 * @property {number} trialDays - The number of days in the trial period
 * @property {"EVERY_30_DAYS"|"ANNUAL"} interval - The interval of the plan
 * @property {Object.<string, Feature>} features - The features of the plan
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the plan
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {Object.<string, Object>} [customFields] - The custom fields on the plan
 * @property {Array.<Discount>} discounts - The discounts on the plan
 * @property {Discount} [autoAppliedDiscount] - The auto apply discount on the plan, if any
 * @property {boolean} [flexBilling] - Whether the plan is part of a flex billing flow
 * @property {string} [flexBillingTerms] - The terms of the flex billing plam
 * @property {string} [autoUpgradeToPlanId] - The ID of the plan to auto upgrade to
 * @property {Plan} [autoUpgradeBasePlan] - The base plan in the auto upgrade relationship
 * @property {string} [createdAt] - The date the plan was created
 * @property {string} [updatedAt] - The date the plan was last updated
 */

/**
 * @typedef PaymentMethod - The payment method of the current customer, if any
 * @property {string} id - The ID of the payment method
 * @property {string} type - The type of the payment method
 * @property {string} brand - The brand of the payment method
 * @property {string} last4 - The last 4 digits of the payment method
 * @property {string} expMonth - The expiration month of the payment method
 * @property {string} expYear - The expiration year of the payment method
 */

/**
 * @typedef UsageMetric - Details about a current user's usage for a particular metric
 * @property {string} id - The ID of the usage metric
 * @property {string} name - The name of the usage metric
 * @property {string} eventName - The description of the usage metric
 * @property {number} currentValue - The current value of the usage metric
 * @property {number} [monthToDateValue] - The month to date value of the usage metric
 * @property {number} [last24HoursValue] - The last 24 hours value of the usage metric
 * @property {number} [last7DaysValue] - The last 7 days value of the usage metric
 * @property {number} [last30DaysValue] - The last 30 days value of the usage metric
 * @property {number} [last90DaysValue] - The last 90 days value of the usage metric
 * @property {number} [last365DaysValue] - The last 365 days value of the usage metric
 * @property {number} [allTimeValue] - The all time value of the usage metric
 * @property {UsageCharge} [usageCharge] - The usage charge of the usage metric
 */

/**
 * @typedef Feature - Details about a feature of a plan or subscription
 * @property {string} id - The ID of the feature
 * @property {string} name - The name of the feature
 * @property {"boolean"|"limit"|"limit_with_overage"} type - The description of the feature
 * @property {string} [description] - The description of the feature
 * @property {*} value - The value of the feature
 * @property {number} displayOrder - The display order of the feature
 */

/**
 * @typedef AppliedDiscount - The discount applied to a subscription
 * @property {string} id - The ID of the discount
 * @property {number} priceAfterDiscount - The price after discount
 * @property {Discount} discount - The discount
 * @property {string} [discountEndsAt] - The date the discount ends
 */

/**
 * @typedef UsageCharge - Details about a usage charge for a plan or subscription
 * @property {string} id - The ID of the usage charge
 * @property {number} amount - The amount of the usage charge
 * @property {"unit"|"unit_limits"|"percent"} type - The type of the usage charge
 * @property {string} [terms] - The terms of the usage charge
 * @property {number} cappedAmount - The capped amount of the usage charge
 * @property {string} [eventName] - The event name of the usage charge
 * @property {string} [limitEventName] - The limit event name of the usage charge
 * @property {number} [limitMin] - The limit minimum of the usage charge
 * @property {number} [limitMax] - The limit maximum of the usage charge
 */

/**
 * @typedef UsageCredit - Details about a usage credit for a customer if one was created for them
 * @property {string} id - The ID of the usage credit
 * @property {string} name - The name of the usage credit
 * @property {string} description - The description of the usage credit
 * @property {number} amount - The original amount of the usage credit
 * @property {number} balance - The remaining balance of the usage credit
 * @property {string} currencyCode - The currency code of the usage credit
 * @property {Date} [expiresAt] - The date the usage credit expires
 * @property {Date} [createdAt] - The date the usage credit was created
 * @property {Date} [updatedAt] - The date the usage credit was last updated
 */

/**
 * @typedef UsageEvent - The model used to send usage events to Mantle. Useful for tracking usage metrics and doing metered billing
 * @property {string} [eventId] - The ID of the usage event. Will be generated if not provided
 * @property {string} eventName - The name of the usage event, which can be tracked by usage metrics
 * @property {string} customerId - The ID of the Mantle customer
 * @property {Object.<string, any>} properties - The properties of the usage event
 */

/**
 * @typedef Discount - Details about a discount for a plan or subscription
 * @property {string} id - The ID of the discount
 * @property {string} name - The name of the discount
 * @property {string} description - The description of the discount
 * @property {number} [amount] - The amount of the discount
 * @property {string} [amountCurrencyCode] - The currency code of the discount amount
 * @property {number} [presentmentAmount] - The presentment amount of the discount
 * @property {number} [presentmentCurrencyCode] - The presentment currency code of the discount
 * @property {number} [percentage] - The percentage of the discount
 * @property {number} [durationLimitInIntervals] - The duration limit of the discount in plan intervals
 * @property {number} discountedAmount - The discounted amount of plan after discount
 * @property {number} presentmentDiscountedAmount - The presentment discounted amount of plan after discount
 */

/**
 * @typedef SetupIntent - Stripe SetupIntent model, used to collect payment method details for later use
 * @property {string} id - The ID of the setup intent
 * @property {string} clientSecret - The client secret of the setup intent
 */

/**
 * @typedef HostedSession - The hosted session, used to send the customer to a hosted page to manage their subscription
 * @property {string} id - The ID of the hosted session
 * @property {string} url - The URL of the hosted session
 */

/**
 * @typedef Address - The address of a customer
 * @property {string} [addressLine1] - The first line of the address
 * @property {string} [addressLine2] - The second line of the address
 * @property {string} [city] - The city of the address
 * @property {string} [state] - The state code of the address, ex. "CA"
 * @property {string} [postalCode] - The postal code of the address
 * @property {string} country - The country code of the address, ex. "US"
 * @property {string} [taxId] - The tax ID of the address
 */

/**
 * @typedef Contact - The contact of a customer
 * @property {"primary"|"secondary"|"billing"|"technical"} label - The label for the type of the contact
 * @property {string} [name] - The name of the contact
 * @property {string} [email] - The email of the contact
 * @property {string} [phone] - The phone of the contact
 */

/**
 * @typedef Review - The review left by the customer on a platform's app store
 * @property {string} id - The ID of the review
 * @property {string} type - The platform the review is on, e.g. "shopify"
 * @property {number} [rating] - The rating of the review
 * @property {string} [content] - The content of the review
 * @property {Date} [date] - The date the review was added to the platform
 */

module.exports = {
  MantleClient,
  SubscriptionConfirmType,
};
