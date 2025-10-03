# Testing Guide

This library now includes comprehensive test coverage using Vitest.

## Setup

First, install the dependencies:

```bash
npm install
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

- **Constructor & Initialization**
  - Creating clients with different authentication methods
  - Validation of required parameters
  - Browser environment detection

- **Customer Identification**
  - Shopify platform identification (platformId and myshopifyDomain)
  - Web and Mantle platform identification
  - API token rotation

- **Customer Management**
  - Getting customer details
  - Feature evaluation (boolean and limit types)
  - Feature limit retrieval

- **Subscription Management**
  - Creating subscriptions (single and multiple plans)
  - Applying discounts
  - Canceling subscriptions
  - Updating subscriptions
  - One-time charges

- **Usage Events**
  - Sending single usage events
  - Sending bulk usage events
  - Getting usage metric reports

- **Payment Methods**
  - Adding payment methods
  - Payment method update options

- **Invoices**
  - Listing invoices with pagination
  - Filtering by status

- **Hosted Sessions**
  - Creating hosted sessions
  - Error handling

- **Notifications**
  - Sending notifications
  - Listing notifications
  - Listing notification templates
  - Triggering notification CTAs
  - Updating notification status

- **Checklists**
  - Getting checklists by ID or handle
  - Filtering checklists by handles
  - Completing checklist steps
  - Skipping checklist steps
  - Marking checklists as shown

- **Error Handling**
  - Network errors
  - API errors
  - Request building and headers

## Test Structure

Tests are located in `src/index.test.ts` and use Vitest with mocked fetch calls to test the API client without making real network requests.

The test suite uses:
- `vi.fn()` for mocking the global fetch function
- `beforeEach()` to clear mocks between tests
- `afterEach()` to restore mocks after tests
- TypeScript for type safety in tests

## Adding New Tests

When adding new methods to the MantleClient:

1. Add test cases in `src/index.test.ts`
2. Mock the expected API responses
3. Verify the correct API calls are made
4. Test both success and error scenarios
5. Run the test suite to ensure everything passes

## Coverage Reports

After running `npm run test:coverage`, you can view:
- Text coverage summary in the terminal
- Detailed HTML report in `coverage/index.html`
- JSON report in `coverage/coverage-final.json`
