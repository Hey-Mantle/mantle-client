
/**
 * @typedef {import('./types').Customer} Customer
 * @typedef {import('./types').Plan} Plan
 * @typedef {import('./types').Subscription} Subscription
 */

class MantleClient {
  /**
   * Creates a new MantleClient. If being used in the browser, or any frontend code, never use the apiKey parameter, always use the customerApiToken for the customer that is currently authenticated on the frontend.
   * @param {Object} params
   * @param {string} params.appId - The Mantle App ID set up on your app in your Mantle account.
   * @param {string} params.apiKey - The Mantle App API key set up on your app in your Mantle account.
   * @param {string} params.customerApiToken - The Mantle Customer API Token returned by the /identify endpoint
   * @param {string} params.apiUrl - The Mantle API URL to use
   */
  constructor({ appId, apiKey, customerApiToken, apiUrl = "https://appapi.heymantle.com/v1" }) {
    if (!appId) {
      throw new Error("MantleClient appId is required");
    }
    if (typeof window !== "undefined" && apiKey) {
      throw new Error("MantleClient apiKey should never be used in the browser");
    }
    if (!apiKey && !customerApiToken) {
      throw new Error("MantleClient one of apiKey or customerApiToken is required");
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
      const response = await fetch(`${this.apiUrl}/v1${path.startsWith('/') ? '' : '/'}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Mantle-App-Id": this.appId,
          ...(this.apiKey ? { "X-Mantle-App-Api-Key": this.apiKey } : {}),
          ...(this.customerApiToken ? { "X-Mantle-Customer-Api-Token": this.customerApiToken } : {}),
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
   * Identify the customer with Mantle
   * @param {string} platformId - The unique ID of the customer on the app platform, for Shopify this should be the Shop ID
   * @param {string} myshopifyDomain - The myshopify.com domain of the Shopify store
   * @param {string} platform - The platform the customer is on, defaults to shopify
   * @param {string} accessToken - The access token for the platform API
   * @param {string} name - The name of the customer
   * @param {string} email - The email of the customer
   * @param {Object} customFields - Any custom fields to send to Mantle
   * @returns {Promise<JSON>} a promise that resolves to the response body
   */
  async identify ({ platformId, myshopifyDomain, platform = 'shopify', accessToken, name, email, customFields }) {
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
   * Subscribe to a plan
   * @param {Object} params - The subscription options
   * @param {string} params.planId - The ID of the plan to subscribe to
   * @param {string} params.returnUrl - The URL to redirect to after the subscription is complete
   * @returns {Promise<Subscription>} a promise that resolves to the created subscription
   */
  async subscribe({ planId, discountId, returnUrl }) {
    return await this.mantleRequest({
      path: "subscriptions",
      method: "POST",
      body: { planId, discountId, returnUrl },
    });
  }

  /**
   * Cancel the current subscription
   * @returns {Promise<Subscription>} a promise that resolves to the cancelled subscription
   */
  async cancelSubscription() {
    return await this.mantleRequest({ path: "subscriptions", method: "DELETE" });
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
   * @param {JSON} params.properties - The event properties
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
   * @param {Array} params.events - The events to send
   * @returns {Promise<boolean>} true if the events were sent successfully
   */
  async sendUsageEvents({ events }) {
    return await this.mantleRequest({
      path: "usage_events",
      method: "POST",
      body: {
        events
      },
    });
  }
}

module.exports = {
  MantleClient,
};