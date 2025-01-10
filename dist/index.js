"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MantleClient: () => MantleClient,
  SubscriptionConfirmType: () => SubscriptionConfirmType
});
module.exports = __toCommonJS(index_exports);
var SubscriptionConfirmType = /* @__PURE__ */ ((SubscriptionConfirmType2) => {
  SubscriptionConfirmType2["finalize"] = "finalize";
  SubscriptionConfirmType2["setup"] = "setup";
  SubscriptionConfirmType2["subscribe"] = "subscribe";
  return SubscriptionConfirmType2;
})(SubscriptionConfirmType || {});
var MantleClient = class {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter,
   * always use the customerApiToken for the customer that is currently authenticated on the frontend.
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
   * @private
   */
  mantleRequest(_0) {
    return __async(this, arguments, function* ({ path, method = "GET", body }) {
      try {
        const url = `${this.apiUrl}${path.startsWith("/") ? "" : "/"}${path}${body && method === "GET" ? `?${new URLSearchParams(body)}` : ""}`;
        const response = yield fetch(url, __spreadValues({
          method,
          headers: __spreadValues(__spreadValues({
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Mantle-App-Id": this.appId
          }, this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {}), this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {})
        }, body && method !== "GET" && {
          body: JSON.stringify(body)
        }));
        const result = yield response.json();
        return result;
      } catch (e) {
        console.error(`[mantleRequest] ${path} error: ${e.message}`);
        throw e;
      }
    });
  }
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
   * @returns A promise that resolves to an object with the customer API token
   */
  identify(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: "identify",
        method: "POST",
        body: params
      });
    });
  }
  /**
   * Get the customer associated with the current customer API token
   * @param id - The ID of the customer to get. Only required if using the API key for authentication instead of the customer API token
   * @returns A promise that resolves to the current customer
   */
  getCustomer(id) {
    return __async(this, null, function* () {
      return (yield this.mantleRequest(__spreadValues({
        path: "customer"
      }, id ? { body: { id } } : {}))).customer;
    });
  }
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
   * @param params.paymentMethodTypes - The payment method types to use for the subscription
   * @param params.automaticTax - Whether to automatically calculate tax for the subscription
   * @param params.requireBillingAddress - Tell the Stripe Checkout Session to require a billing address
   * @param params.email - Prefill the Stripe customer's email address
   * @param params.metadata - The metadata to attach to the subscription
   * @returns A promise that resolves to the created subscription
   */
  subscribe(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: "subscriptions",
        method: "POST",
        body: params
      });
    });
  }
  /**
   * Cancel the current subscription
   * @param params.cancelReason - The reason for cancelling the subscription
   * @returns A promise that resolves to the cancelled subscription
   */
  cancelSubscription(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest(__spreadValues({
        path: "subscriptions",
        method: "DELETE"
      }, (params == null ? void 0 : params.cancelReason) && {
        body: { cancelReason: params.cancelReason }
      }));
    });
  }
  /**
   * Update the subscription
   * @param params.id - The ID of the subscription to update
   * @param params.cappedAmount - The capped amount of the usage charge
   * @returns A promise that resolves to the updated subscription
   */
  updateSubscription(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: "subscriptions",
        method: "PUT",
        body: params
      });
    });
  }
  /**
   * Send a usage event
   * @param params.eventId - The ID of the event
   * @param params.eventName - The name of the event which can be tracked by usage metrics
   * @param params.timestamp - The timestamp of the event, leave blank to use the current time
   * @param params.customerId - Required if customerApiToken is not used for authentication
   * @param params.properties - The event properties
   * @returns A promise that resolves to true if the event was sent successfully
   */
  sendUsageEvent(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: "usage_events",
        method: "POST",
        body: params
      });
    });
  }
  /**
   * Send multiple usage events of the same type in bulk
   * @param params.events - The events to send
   * @returns A promise that resolves to true if the events were sent successfully
   */
  sendUsageEvents(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: "usage_events",
        method: "POST",
        body: params
      });
    });
  }
  /**
   * Initial step to start the process of connecting a new payment method from an external billing provider
   * @param params.returnUrl - The URL to redirect to after a checkout has completed
   * @returns A promise that resolves to the created SetupIntent with clientSecret
   */
  addPaymentMethod(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest(__spreadValues({
        path: "payment_methods",
        method: "POST"
      }, params.returnUrl && {
        body: { returnUrl: params.returnUrl }
      }));
    });
  }
  /**
   * Get report of a usage metric over time intervals
   * @param params.id - The usage metric id
   * @param params.period - The interval to get the report for
   * @param params.customerId - The customer ID to get the report for
   * @returns A promise that resolves to the usage metric report
   */
  getUsageMetricReport(params) {
    return __async(this, null, function* () {
      return yield this.mantleRequest({
        path: `usage_events/${params.id}/report`,
        body: __spreadValues(__spreadValues({}, params.period ? { period: params.period } : {}), params.customerId ? { customerId: params.customerId } : {})
      });
    });
  }
  /**
   * Get a list of invoices for the current customer
   * @param params.page - The page number to get, defaults to 0
   * @param params.limit - The number of invoices to get per page, defaults to 10
   * @returns A promise that resolves to the list of invoices
   */
  listInvoices() {
    return __async(this, arguments, function* (params = {}) {
      var _a, _b;
      return yield this.mantleRequest({
        path: "invoices",
        body: {
          page: (_a = params.page) != null ? _a : 0,
          limit: (_b = params.limit) != null ? _b : 10
        }
      });
    });
  }
  /**
   * Create a hosted session that can be used to send the customer to a hosted page to manage their subscription
   * @param params.type - The type of hosted session to create
   * @param params.config - The configuration for the hosted session
   * @returns A promise that resolves to the hosted session with a url property
   */
  createHostedSession(params) {
    return __async(this, null, function* () {
      const response = yield this.mantleRequest({
        path: "hosted_sessions",
        method: "POST",
        body: params
      });
      return __spreadValues(__spreadValues({}, (response == null ? void 0 : response.session) || {}), (response == null ? void 0 : response.error) || { error: response.error });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MantleClient,
  SubscriptionConfirmType
});
