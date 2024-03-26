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
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account. This should never be used in the browser.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint. This should be used in the browser.
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
   * @param {"customer"|"usage_events"|"subscriptions"} params.path - The path to request
   * @param {"GET"|"POST"|"PUT"|"DELETE"} params.method - The HTTP method to use. Defaults to GET
   * @param {JSON} [params.body] - The request body
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async mantleRequest({ path, method = "GET", body }) {
    try {
      const response = await fetch(`${this.apiUrl}${path.startsWith("/") ? "" : "/"}${path}`, {
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
        ...(body && {
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
   * @param {string} params.platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
   * @param {string} params.myshopifyDomain - The myshopify.com domain of the Shopify store
   * @param {string} [params.platform] - The platform the customer is on, defaults to shopify
   * @param {string} params.accessToken - The access token for the platform API, for Shopify apps, this should be the Shop access token
   * @param {string} params.name - The name of the customer
   * @param {string} params.email - The email of the customer
   * @param {Object.<string, Object>} [params.customFields] - Custom fields to store on the customer, must be a JSON object
   * @returns {Promise<Object.<string, string>} a promise that resolves to an object with the customer API token, `apiToken`
   */
  async identify({
    platformId,
    myshopifyDomain,
    platform = "shopify",
    accessToken,
    name,
    email,
    customFields,
  }) {
    return await this.mantleRequest({
      path: "identify",
      method: "POST",
      body: { platformId, myshopifyDomain, platform, accessToken, name, email, customFields },
    });
  }

  /**
   * Get the customer associated with the current customer API token
   * @returns {Promise<Customer>} a promise that resolves to the current customer
   */
  async getCustomer() {
    return (await this.mantleRequest({ path: "customer" })).customer;
  }

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
  async subscribe({ planId, planIds, discountId, returnUrl, billingProvider }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId, planIds, discountId, returnUrl, billingProvider },
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
   * @param {string} params.customerId - Required if customerApiToken is not used for authentication. One of either the customer token, Mantle customer ID, platform ID / Shopify Shop ID, Shopify myshopify.com domain
   * @param {Object.<string, any>} params.properties - The event properties
   * @returns {Promise<boolean>} true if the event was sent successfully
   */
  async sendUsageEvent({ eventId, eventName, customerId, properties = {} }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        eventId,
        eventName,
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
   * Internally attempts to create a Stripe `SetupIntent` and returns a `clientSecret`, which can be used to initialize
   * Stripe Elements or Stripe Checkout to collect payment method details to save for later use.
   * @param {Object} params
   * @param {string} [params.returnUrl] - The URL to redirect to after a checkout has completed
   * @returns {Promise<SetupIntent>} a promise that resolves to the created `SetupIntent` with `clientSecret`
   */
  async requestClientSecret({ returnUrl }) {
    return await this.mantleRequest({
      resource: "payment_methods",
      method: "GET",
      ...(returnUrl && {
        body: { returnUrl },
      }),
    });
  }

  /**
   * Set the payment method for the current customer
   * @param {Object} params - The payment method options
   * @param {string} params.paymentMethodId - The platform ID of the payment method to add to the customer, ex. `pm_1234567890`
   * @param {boolean} [params.defaultMethod=true] - Whether to set the payment method as the default for this customer
   * @returns {Promise<PaymentMethod>} a promise that resolves to the updated payment method
   */
  async connectPaymentMethod({ paymentMethodId, defaultMethod = true }) {
    return await this.mantleRequest({
      resource: "payment_methods",
      method: "PUT",
      body: {
        paymentMethodId,
        defaultMethod,
      },
    });
  }
}

/**
 * @typedef UsageMetric
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
 * @typedef Feature
 * @property {string} id - The ID of the feature
 * @property {string} name - The name of the feature
 * @property {"boolean"|"limit"|"limit_with_overage"} type - The description of the feature
 * @property {string} [description] - The description of the feature
 * @property {*} value - The value of the feature
 * @property {number} displayOrder - The display order of the feature
 */

/**
 * @typedef AppliedDiscount
 * @property {string} id - The ID of the discount
 * @property {number} priceAfterDiscount - The price after discount
 * @property {Discount} discount - The discount
 * @property {string} [discountEndsAt] - The date the discount ends
 */

/**
 * @typedef Subscription
 * @property {string} id - The ID of the subscription
 * @property {Plan} plan - The plan of the subscription
 * @property {boolean} active - Whether the subscription is active
 * @property {string} [activatedAt] - The date the subscription was activated
 * @property {string} [cancelledAt] - The date the subscription was cancelled
 * @property {string} [frozenAt] - The date the subscription was frozen
 * @property {Object.<string, Feature>} features - The features of the subscription
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the subscription
 * @property {string} [createdAt] - The date the subscription was created
 * @property {URL} [confirmationUrl] - The URL to confirm the subscription
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {number} [usageBalanceUsed] - The amount of the usage balance used
 * @property {AppliedDiscount} [appliedDiscount]
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 */

/**
 * @typedef UsageCharge
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
 * @typedef UsageEvent
 * @property {string} [eventId] - The ID of the usage event. Will be generated if not provided
 * @property {string} eventName - The name of the usage event, which can be tracked by usage metrics
 * @property {string} customerId - The ID of the Mantle customer
 * @property {Object.<string, any>} properties - The properties of the usage event
 */

/**
 * @typedef Discount
 * @property {string} id - The ID of the discount
 * @property {number} [amount] - The amount of the discount
 * @property {string} [amountCurrencyCode] - The currency code of the discount amount
 * @property {number} [percentage] - The percentage of the discount
 * @property {number} [durationLimitInIntervals] - The duration limit of the discount in plan intervals
 * @property {number} discountedAmount - The discounted amount of plan after discount
 */

/**
 * @typedef Plan
 * @property {string} id - The ID of the plan
 * @property {string} name - The name of the plan
 * @property {string} availability - The availability of the plan, one of "public", "customerTag", "customer", "shopifyPlan" or "hidden"
 * @property {string} currencyCode - The currency code of the plan
 * @property {number} total - The total amount of the plan, after discounts if applicable
 * @property {number} subtotal - The subtotal amount of the plan, before discounts if applicable
 * @property {number} amount - [Deprecated] use subtotal instead
 * @property {boolean} public - Whether the plan is public
 * @property {number} trialDays - The number of days in the trial period
 * @property {"EVERY_30_DAYS"|"ANNUAL"} interval - The interval of the plan
 * @property {Object.<string, Feature>} features - The features of the plan
 * @property {Array.<string>} featuresOrder - The order of the features by key
 * @property {Array.<UsageCharge>} usageCharges - The usage charges of the plan
 * @property {number} [usageChargeCappedAmount] - The capped amount of the usage charge
 * @property {Object.<string, Object>} [customFields] - The custom fields on the plan
 * @property {Array.<Discount>} discounts - The discounts on the plan
 * @property {Discount} [autoAppliedDiscount] - The auto apply discount on the plan, if any
 * @property {string} [createdAt] - The date the plan was created
 * @property {string} [updatedAt] - The date the plan was last updated
 */

/**
 * @typedef Customer
 * @property {string} id - The ID of the customer
 * @property {boolean} test - Whether the customer is a test customer
 * @property {Array.<Plan>} plans - The plans available to the customer
 * @property {Subscription} [subscription] - The subscription of the current customer, if any
 * @property {Object.<string, Feature>} features - The features enabled for the current customer
 * @property {Object.<string, UsageMetric>} usage - The usage metrics for the current customer
 * @property {Object.<string, Object>} [customFields] - The custom fields on the customer
 */

/**
 * @typedef PaymentMethod
 * @property {string} id - The ID of the payment method
 * @property {string} type - The type of the payment method
 * @property {string} brand - The brand of the payment method
 * @property {string} last4 - The last 4 digits of the payment method
 * @property {string} expMonth - The expiration month of the payment method
 * @property {string} expYear - The expiration year of the payment method
 */

/**
 * @typedef SetupIntent
 * @property {string} id - The ID of the setup intent
 * @property {string} clientSecret - The client secret of the setup intent
 */

module.exports = {
  MantleClient,
};
