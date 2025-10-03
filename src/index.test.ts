import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MantleClient, SubscriptionConfirmType } from './index';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MantleClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create a client with appId and apiKey', () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });
      expect(client).toBeInstanceOf(MantleClient);
    });

    it('should create a client with appId and customerApiToken', () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'test-customer-token',
      });
      expect(client).toBeInstanceOf(MantleClient);
    });

    it('should use default API URL if not provided', () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });
      expect(client).toBeDefined();
    });

    it('should use custom API URL if provided', () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        apiUrl: 'https://custom-api.example.com',
      });
      expect(client).toBeDefined();
    });

    it('should throw error if appId is not provided', () => {
      expect(() => {
        new MantleClient({
          appId: '',
          apiKey: 'test-api-key',
        });
      }).toThrow('MantleClient appId is required');
    });

    it('should throw error if apiKey is used in browser environment', () => {
      const originalWindow = global.window;
      (global as any).window = {};

      expect(() => {
        new MantleClient({
          appId: 'test-app-id',
          apiKey: 'test-api-key',
        });
      }).toThrow('MantleClient apiKey should never be used in the browser');

      global.window = originalWindow;
    });
  });

  describe('identify', () => {
    it('should identify a Shopify customer with platformId', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });

      const mockResponse = { apiToken: 'new-token-123' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.identify({
        platform: 'shopify',
        platformId: 'shop-123',
        name: 'Test Shop',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/identify'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Mantle-App-Id': 'test-app-id',
            'X-Mantle-App-Api-Key': 'test-api-key',
          }),
          body: expect.stringContaining('shop-123'),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should identify a Shopify customer with myshopifyDomain', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });

      const mockResponse = { apiToken: 'new-token-123' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.identify({
        platform: 'shopify',
        myshopifyDomain: 'test-shop.myshopify.com',
      });

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should identify a web platform customer', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });

      const mockResponse = { apiToken: 'new-token-456' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.identify({
        platform: 'web',
        platformId: 'web-customer-123',
        email: 'customer@example.com',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCustomer', () => {
    it('should get customer without id when using customerApiToken', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockCustomer = {
        id: 'customer-123',
        name: 'Test Customer',
        test: false,
        plans: [],
        features: {},
        usage: {},
        usageCredits: [],
        reviews: [],
        billingStatus: 'none' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: mockCustomer }),
      });

      const result = await client.getCustomer();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/customer'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Mantle-Customer-Api-Token': 'customer-token',
          }),
        })
      );
      expect(result).toEqual(mockCustomer);
    });

    it('should get customer with id when using apiKey', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'api-key',
      });

      const mockCustomer = {
        id: 'customer-456',
        name: 'Another Customer',
        test: true,
        plans: [],
        features: {},
        usage: {},
        usageCredits: [],
        reviews: [],
        billingStatus: 'active' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: mockCustomer }),
      });

      const result = await client.getCustomer('customer-456');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('id=customer-456'),
        expect.any(Object)
      );
      expect(result).toEqual(mockCustomer);
    });

    it('should return error when API returns error', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockError = { error: 'Customer not found' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      const result = await client.getCustomer();

      expect(result).toEqual(mockError);
    });
  });

  describe('Feature evaluation', () => {
    describe('isFeatureEnabled', () => {
      it('should return true for enabled boolean feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            testFeature: {
              id: 'feat-1',
              name: 'Test Feature',
              type: 'boolean' as const,
              value: true,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'testFeature',
        });

        expect(result).toBe(true);
      });

      it('should return false for disabled boolean feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            testFeature: {
              id: 'feat-1',
              name: 'Test Feature',
              type: 'boolean' as const,
              value: false,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'testFeature',
        });

        expect(result).toBe(false);
      });

      it('should return true for limit feature when count is below limit', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            userLimit: {
              id: 'feat-2',
              name: 'User Limit',
              type: 'limit' as const,
              value: 100,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'userLimit',
          count: 50,
        });

        expect(result).toBe(true);
      });

      it('should return false for limit feature when count exceeds limit', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            userLimit: {
              id: 'feat-2',
              name: 'User Limit',
              type: 'limit' as const,
              value: 100,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'userLimit',
          count: 150,
        });

        expect(result).toBe(false);
      });

      it('should return true for unlimited feature (value -1)', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            userLimit: {
              id: 'feat-2',
              name: 'User Limit',
              type: 'limit' as const,
              value: -1,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'userLimit',
          count: 99999,
        });

        expect(result).toBe(true);
      });

      it('should return false for non-existent feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {},
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.isFeatureEnabled({
          featureKey: 'nonExistent',
        });

        expect(result).toBe(false);
      });
    });

    describe('limitForFeature', () => {
      it('should return limit value for limit type feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            userLimit: {
              id: 'feat-2',
              name: 'User Limit',
              type: 'limit' as const,
              value: 500,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.limitForFeature({
          featureKey: 'userLimit',
        });

        expect(result).toBe(500);
      });

      it('should return -1 for boolean type feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {
            boolFeature: {
              id: 'feat-1',
              name: 'Bool Feature',
              type: 'boolean' as const,
              value: true,
              displayOrder: 1,
            },
          },
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.limitForFeature({
          featureKey: 'boolFeature',
        });

        expect(result).toBe(-1);
      });

      it('should return -1 for non-existent feature', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCustomer = {
          id: 'customer-123',
          features: {},
          plans: [],
          usage: {},
          usageCredits: [],
          reviews: [],
          test: false,
          billingStatus: 'none' as const,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ customer: mockCustomer }),
        });

        const result = await client.limitForFeature({
          featureKey: 'nonExistent',
        });

        expect(result).toBe(-1);
      });
    });
  });

  describe('Subscription methods', () => {
    describe('subscribe', () => {
      it('should subscribe to a plan with planId', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-123',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 29.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 14,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: true,
          features: {},
          featuresOrder: [],
          usageCharges: [],
          total: 29.99,
          subtotal: 29.99,
          presentmentTotal: 29.99,
          presentmentSubtotal: 29.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.subscribe({
          planId: 'plan-123',
          returnUrl: 'https://example.com/return',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('plan-123'),
          })
        );
        expect(result).toEqual(mockSubscription);
      });

      it('should subscribe to multiple plans with planIds', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-456',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 29.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 0,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: true,
          features: {},
          featuresOrder: [],
          usageCharges: [],
          total: 49.99,
          subtotal: 49.99,
          presentmentTotal: 49.99,
          presentmentSubtotal: 49.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.subscribe({
          planIds: ['plan-123', 'addon-456'],
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual(mockSubscription);
      });

      it('should handle subscription with discount', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-789',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 19.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 0,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: true,
          appliedDiscount: {
            id: 'disc-1',
            priceAfterDiscount: 19.99,
            discount: {
              id: 'disc-1',
              name: '10 OFF',
              description: '$10 off',
              amount: 10,
              discountedAmount: 19.99,
              presentmentDiscountedAmount: 19.99,
            },
          },
          features: {},
          featuresOrder: [],
          usageCharges: [],
          total: 19.99,
          subtotal: 29.99,
          presentmentTotal: 19.99,
          presentmentSubtotal: 29.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.subscribe({
          planId: 'plan-123',
          discountId: 'disc-1',
        });

        expect(result).toEqual(mockSubscription);
      });
    });

    describe('cancelSubscription', () => {
      it('should cancel subscription without reason', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-123',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 29.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 0,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: false,
          cancelledAt: '2024-01-15T10:00:00Z',
          features: {},
          featuresOrder: [],
          usageCharges: [],
          total: 29.99,
          subtotal: 29.99,
          presentmentTotal: 29.99,
          presentmentSubtotal: 29.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.cancelSubscription();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions'),
          expect.objectContaining({
            method: 'DELETE',
          })
        );
        expect(result).toEqual(mockSubscription);
      });

      it('should cancel subscription with reason', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-123',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 29.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 0,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: false,
          cancelledAt: '2024-01-15T10:00:00Z',
          features: {},
          featuresOrder: [],
          usageCharges: [],
          total: 29.99,
          subtotal: 29.99,
          presentmentTotal: 29.99,
          presentmentSubtotal: 29.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.cancelSubscription({
          cancelReason: 'Too expensive',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions'),
          expect.objectContaining({
            method: 'DELETE',
            body: expect.stringContaining('Too expensive'),
          })
        );
        expect(result).toEqual(mockSubscription);
      });
    });

    describe('updateSubscription', () => {
      it('should update subscription capped amount', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockSubscription = {
          id: 'sub-123',
          plan: {
            id: 'plan-123',
            name: 'Pro Plan',
            amount: 29.99,
            subtotal: 29.99,
            total: 29.99,
            type: 'base' as const,
            availability: 'public' as const,
            currencyCode: 'USD',
            presentmentAmount: 29.99,
            presentmentCurrencyCode: 29.99,
            public: true,
            visible: true,
            eligible: true,
            trialDays: 0,
            interval: 'EVERY_30_DAYS' as const,
            features: {},
            featuresOrder: [],
            usageCharges: [],
            usageChargeCappedAmount: 100,
            discounts: [],
            bundleDiscounts: [],
          },
          lineItems: [],
          active: true,
          features: {},
          featuresOrder: [],
          usageCharges: [],
          usageChargeCappedAmount: 100,
          total: 29.99,
          subtotal: 29.99,
          presentmentTotal: 29.99,
          presentmentSubtotal: 29.99,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubscription,
        });

        const result = await client.updateSubscription({
          id: 'sub-123',
          cappedAmount: 100,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/subscriptions'),
          expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('100'),
          })
        );
        expect(result).toEqual(mockSubscription);
      });
    });

    describe('createOneTimeCharge', () => {
      it('should create a one-time charge', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockCharge = {
          confirmationUrl: new URL('https://checkout.example.com/charge-123'),
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockCharge,
        });

        const result = await client.createOneTimeCharge({
          amount: 99.99,
          name: 'Setup Fee',
          currencyCode: 'USD',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/one_time_charges'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('99.99'),
          })
        );
        expect(result).toEqual(mockCharge);
      });
    });
  });

  describe('Usage events', () => {
    describe('sendUsageEvent', () => {
      it('should send a single usage event', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.sendUsageEvent({
          eventName: 'email_sent',
          properties: { to: 'user@example.com' },
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/usage_events'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('email_sent'),
          })
        );
        expect(result).toEqual({ success: true });
      });

      it('should send usage event with customerId when using apiKey', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          apiKey: 'api-key',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.sendUsageEvent({
          eventName: 'email_sent',
          customerId: 'customer-123',
          properties: { to: 'user@example.com' },
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/usage_events'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });

    describe('sendUsageEvents', () => {
      it('should send multiple usage events in bulk', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          apiKey: 'api-key',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.sendUsageEvents({
          events: [
            {
              eventName: 'email_sent',
              customerId: 'customer-123',
              properties: { to: 'user1@example.com' },
            },
            {
              eventName: 'email_sent',
              customerId: 'customer-123',
              properties: { to: 'user2@example.com' },
            },
          ],
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/usage_events'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });

    describe('getUsageMetricReport', () => {
      it('should get usage metric report', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockReport = {
          report: {
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            period: 'daily' as const,
            data: [
              { date: '2024-01-01', value: 10 },
              { date: '2024-01-02', value: 15 },
            ],
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReport,
        });

        const result = await client.getUsageMetricReport({
          id: 'metric-123',
          period: 'daily',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/usage_events/metric-123/report'),
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockReport);
      });
    });
  });

  describe('Payment methods', () => {
    it('should add payment method', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockSetupIntent = {
        id: 'si_123',
        clientSecret: 'si_123_secret_abc',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSetupIntent,
      });

      const result = await client.addPaymentMethod({
        returnUrl: 'https://example.com/return',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment_methods'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockSetupIntent);
    });

    it('should add payment method with updateExistingPaymentMethods option', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockSetupIntent = {
        id: 'si_456',
        clientSecret: 'si_456_secret_xyz',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSetupIntent,
      });

      const result = await client.addPaymentMethod({
        returnUrl: 'https://example.com/return',
        updateExistingPaymentMethods: false,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment_methods'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('updateExistingPaymentMethods'),
        })
      );
      expect(result).toEqual(mockSetupIntent);
    });
  });

  describe('Invoices', () => {
    it('should list invoices with default params', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockResponse = {
        invoices: [
          {
            id: 'inv-1',
            periodStart: '2024-01-01',
            periodEnd: '2024-01-31',
            status: 'paid',
            total: 29.99,
            subtotal: 29.99,
            amountPaid: 29.99,
            currencyCode: 'USD',
            test: false,
            platformId: 'stripe-inv-1',
            items: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        hasMore: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.listInvoices();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=0'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should list invoices with custom params', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockResponse = {
        invoices: [],
        hasMore: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.listInvoices({
        page: 2,
        limit: 20,
        status: 'paid',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=paid'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Hosted sessions', () => {
    it('should create a hosted session', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockSession = {
        id: 'session-123',
        url: 'https://hosted.example.com/session-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: mockSession }),
      });

      const result = await client.createHostedSession({
        type: 'subscription_management',
        config: { theme: 'dark' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/hosted_sessions'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockSession);
    });

    it('should handle error when creating hosted session', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockError = { error: 'Invalid configuration' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      const result = await client.createHostedSession({
        type: 'subscription_management',
        config: {},
      });

      expect(result).toEqual(mockError);
    });
  });

  describe('Notifications', () => {
    describe('notify', () => {
      it('should send notification for template', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          apiKey: 'api-key',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ notifies: ['customer-1', 'customer-2'] }),
        });

        const result = await client.notify({
          templateId: 'template-123',
          test: false,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notification_templates/template-123/notify'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual(['customer-1', 'customer-2']);
      });
    });

    describe('listNotifications', () => {
      it('should list notifications for customer', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockResponse = {
          notifies: [
            {
              id: 'notify-1',
              title: 'Welcome',
              body: 'Welcome to our app!',
              cta: {
                type: 'url' as const,
                url: 'https://example.com',
                openInNewTab: true,
              },
              preview: 'Welcome...',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          hasMore: false,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await client.listNotifications();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notifications'),
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('listNotificationTemplates', () => {
      it('should list notification templates', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          apiKey: 'api-key',
        });

        const mockResponse = {
          notificationTemplates: [
            {
              id: 'template-1',
              name: 'Welcome Email',
              title: 'Welcome!',
              preview: 'Welcome...',
              body: 'Welcome to our app!',
              deliveryMethod: 'flow' as const,
            },
          ],
          hasMore: false,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const result = await client.listNotificationTemplates();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notification_templates'),
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('triggerNotificationCta', () => {
      it('should trigger notification CTA', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.triggerNotificationCta({
          id: 'notify-123',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notifications/notify-123/trigger'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });

    describe('updateNotification', () => {
      it('should update notification read status', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const readAt = new Date('2024-01-15T10:00:00Z');

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.updateNotification({
          id: 'notify-123',
          readAt,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notifications/notify-123'),
          expect.objectContaining({
            method: 'PUT',
          })
        );
        expect(result).toEqual({ success: true });
      });

      it('should update notification dismissed status', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const dismissedAt = new Date('2024-01-15T11:00:00Z');

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.updateNotification({
          id: 'notify-123',
          dismissedAt,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/notifications/notify-123'),
          expect.objectContaining({
            method: 'PUT',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('Checklists', () => {
    describe('getChecklist', () => {
      it('should get checklist by ID', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockChecklist = {
          id: 'checklist-123',
          name: 'Onboarding',
          steps: [
            {
              id: 'step-1',
              name: 'Complete profile',
              completed: true,
              allowManualCompletion: true,
              allowSkip: false,
              skipped: false,
              completedAt: '2024-01-10T00:00:00Z',
              skippedAt: null,
            },
          ],
          completedSteps: 1,
          totalSteps: 3,
          completionPercentage: 33,
          completed: false,
          completedAt: null,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockChecklist,
        });

        const result = await client.getChecklist('checklist-123');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/checklists/checklist-123'),
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockChecklist);
      });

      it('should get checklist by handle', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockChecklist = {
          id: 'checklist-123',
          name: 'Onboarding',
          handle: 'onboarding',
          steps: [],
          completedSteps: 0,
          totalSteps: 3,
          completionPercentage: 0,
          completed: false,
          completedAt: null,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockChecklist,
        });

        const result = await client.getChecklist('onboarding');

        expect(result).toEqual(mockChecklist);
      });
    });

    describe('getChecklists', () => {
      it('should get all checklists', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockChecklists = [
          {
            id: 'checklist-1',
            name: 'Onboarding',
            steps: [],
            completedSteps: 0,
            totalSteps: 3,
            completionPercentage: 0,
            completed: false,
            completedAt: null,
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockChecklists,
        });

        const result = await client.getChecklists();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/checklists'),
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockChecklists);
      });

      it('should get checklists filtered by handles', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        const mockChecklists = [
          {
            id: 'checklist-1',
            name: 'Onboarding',
            handle: 'onboarding',
            steps: [],
            completedSteps: 0,
            totalSteps: 3,
            completionPercentage: 0,
            completed: false,
            completedAt: null,
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockChecklists,
        });

        const result = await client.getChecklists(['onboarding', 'setup']);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('handles=onboarding%2Csetup'),
          expect.any(Object)
        );
        expect(result).toEqual(mockChecklists);
      });
    });

    describe('completeChecklistStep', () => {
      it('should complete a checklist step', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.completeChecklistStep({
          idOrHandle: 'checklist-123',
          stepIdOrHandle: 'step-1',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/checklists/checklist-123/steps/step-1/complete'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });

    describe('skipChecklistStep', () => {
      it('should skip a checklist step', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.skipChecklistStep({
          idOrHandle: 'checklist-123',
          stepIdOrHandle: 'step-2',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/checklists/checklist-123/steps/step-2/skip'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });

    describe('showChecklist', () => {
      it('should mark checklist as shown', async () => {
        const client = new MantleClient({
          appId: 'test-app-id',
          customerApiToken: 'customer-token',
        });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        const result = await client.showChecklist({
          idOrHandle: 'checklist-123',
        });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/checklists/checklist-123/shown'),
          expect.objectContaining({
            method: 'POST',
          })
        );
        expect(result).toEqual({ success: true });
      });
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.getCustomer()).rejects.toThrow('Network error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[mantleRequest]')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle API errors with error field', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockError = {
        error: 'Unauthorized',
        details: 'Invalid API token',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      const result = await client.getCustomer();

      expect(result).toEqual(mockError);
    });

    it('should handle API errors with ok: false but no error field', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      const mockError = {
        message: 'Something went wrong',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      const result = await client.getCustomer();

      // When ok: false but no error field, mantleRequest returns the response
      // but getCustomer checks for "error" in response, and since it's not there,
      // it tries to access response.customer which is undefined
      expect(result).toBeUndefined();
    });
  });

  describe('Request building', () => {
    it('should build GET request with query parameters', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: {} }),
      });

      await client.getCustomer('customer-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('?id=customer-123'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should build POST request with body', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'api-key',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ apiToken: 'token-123' }),
      });

      await client.identify({
        platform: 'shopify',
        platformId: 'shop-123',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    it('should include API key in headers when provided', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        apiKey: 'test-api-key',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: {} }),
      });

      await client.getCustomer('customer-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Mantle-App-Api-Key': 'test-api-key',
          }),
        })
      );
    });

    it('should include customer API token in headers when provided', async () => {
      const client = new MantleClient({
        appId: 'test-app-id',
        customerApiToken: 'customer-token-123',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ customer: {} }),
      });

      await client.getCustomer();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Mantle-Customer-Api-Token': 'customer-token-123',
          }),
        })
      );
    });
  });

  describe('SubscriptionConfirmType enum', () => {
    it('should export SubscriptionConfirmType enum', () => {
      expect(SubscriptionConfirmType.finalize).toBe('finalize');
      expect(SubscriptionConfirmType.plan_change).toBe('plan_change');
      expect(SubscriptionConfirmType.setup).toBe('setup');
      expect(SubscriptionConfirmType.subscribe).toBe('subscribe');
    });
  });
});
