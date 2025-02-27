# Mantle API Client for JavaScript

A simple interface for interacting with the [Mantle](https://heymantle.com) App API.

## Installation

You can install the Mantle App API library using npm:

```bash
$ npm install @heymantle/client
```

## Usage

The first thing you'll want to do is identify the customer/shop to Mantle using the `identify` endpoint:

```js
const { MantleClient } = require('@heymantle/client');
const client = new MantleClient({
  appId: process.env.MANTLE_APP_ID,
  apiKey: process.env.MANTLE_API_KEY,
});
const { apiToken: customerApiToken } = await client.identify({
  platform: 'shopify',
  platformId: shop.id,
  myshopifyDomain: shop.myshopifyDomain,
  accessToken: shop.accessToken,
  name: shop.name,
  email: shop.email,
  customFields: {
    'Custom 1': 1234,
    'Custom 2': 'abc',
  },
});
```

Once identified, you can perform customer-specific operations:

- Fetch the customer, subscription, and plan details
- Create and update the customer subscription
- Push usage events associated with the customer

### NOTE: Authentication

The primary way to authenticate is using the Mantle app ID and API key that you generate in the Mantle dashboard for a specific app. The API key should *never* be used in frontend code or code that will be exposed in the browser. Instead, you can use the customer API token returned from the `identify` request in frontend requests, but this is only secure when using it on frontend requests that are authenticated to that customer since it's exposing only their own token.

```js
const client = require('@heymantle/client');
const client = new MantleClient({
  appId: process.env.MANTLE_APP_ID,
  customerApiToken: shop.mantleApiToken,
});
```

### getCustomer()

Fetches the current/authenticated customer. For example:

```js
const { customer } = await client.getCustomer();
console.log(customer)
```

```
{
  "id": "123",
  "test": false,
  "installedAt": "2023-10-25",
  "trialStartsAt": "2023-10-25",
  "trialExpiresAt": "2023-11-03",
  plans: {
    "id: "345",
    "name": "Advanced",
    ...
  },
  subscription: {
    ...
  },
  features: {
    ...
  },
  usage: {
    ...
  },
  customFields: {
    ...
  }
}
```

### subscribe

Inititates the subscribe process, creates a pending subscription in Mantle and returns the subscription object, including the `confirmationUrl` that you would redirect the customer to in order to authorize the charge. For example:

```js
const { confirmationUrl } = await client.subscribe({
  planId: "345",
  returnUrl: "https://myapp.com/charge_callback"
});
```

### cancelSubscription

Cancels the current active subscription for the customer and returns the cancelled subscription object.

```js
await client.cancelSubscription();
```

### sendUsageEvent

Pushes a usage event to Mantle for this customer. Usage events can be used to send usage based billing events, such as when an order is created in Shopify, and Mantle will automatically create the appropriate usage charges for the customer. Usage events can also be used as a general purpose event stream where you can view reports and analytics on those events, including funnel events, for example when certain onboarding steps are completed.

```js
await client.sendUsageEvent({
  eventId: 123, // optional idempotency key, if this isn't sent then Mantle will automatically generate the value
  eventName: "order_created",
  customerId: "example.myshopify.com", // this is only needed if you don't use customerApiToken authentication
  properties: {
    order_value: 150,
    processed_at: "2023-10-26",
    customer_name: "Peter Parker",
  },
});
```

```js
await client.sendUsageEvent({
  eventName: "page_view",
  properties: {
    path: location.href,
  },
});
```

## Using Stripe billing provider with Checkout Sessions

1. Create your Mantle application, connect Stripe as a billing provider
2. Create Mantle API client, add details it to your .env file
3. Create plans which will propagate to Stripe
4. Identify with defaultBillingProvider flag, 'stripe' - this will create a customer in Stripe and link it to the Mantle customer if one doesn't exist, otherwise it will link the existing Stripe customer to the Mantle customer

```javascript
const result = await mantleClient.identify({
  platform: 'shopify',
  platformId: id,
  myshopifyDomain,
  accessToken,
  name,
  email,
  defaultBillingProvider: "stripe",
});
```

5. Fetch plans using /customer API
6. Call subscribe API to create subscription and redirect to `confirmationUrl`

```javascript
const subscription = await subscribe({
  planId: plan.id,
  hosted: true,
  requireBillingAddress: true, // optional, defaults to false
  email: "email@customer.com", // optional, defaults to nil, used to prefill customer email in Stripe checkout
  metadata: {
    key: "value",
  }, // optional, defaults to nil, adds metadata to the newly created subscription in Stripe
});
open(subscription.confirmationUrl, "_top");
```

## Documentation

Documentation is available at [https://heymantle.com/docs/integrate](https://heymantle.com/docs/integrate).
