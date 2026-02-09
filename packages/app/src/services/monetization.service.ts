import { config } from '../config';

// RevenueCat types
export interface PurchasePackage {
  identifier: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
}

export interface CustomerInfo {
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  entitlements: {
    active: Record<string, unknown>;
    all: Record<string, unknown>;
  };
}

class MonetizationService {
  private isInitialized = false;
  private Purchases: unknown;

  async initialize(_userId?: string): Promise<void> {
    if (this.isInitialized) return;

    // RevenueCat only works on mobile
    if (typeof window !== 'undefined') {
      console.warn('RevenueCat is only available on mobile platforms');
      return;
    }

    const { apiKey, appleKey, googleKey } = config.monetization.revenueCat;

    if (!apiKey && !appleKey && !googleKey) {
      console.warn('RevenueCat API keys not configured');
      return;
    }

    // Note: Mobile (React Native) monetization with react-native-purchases
    // is not supported in web builds to avoid import resolution issues
    console.warn('RevenueCat monetization is only available on mobile platforms');
    return;
  }

  async getOfferings(): Promise<PurchasePackage[]> {
    if (!this.isInitialized || !this.Purchases) return [];

    try {
      const offerings = await this.Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) return [];

      return currentOffering.availablePackages;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return [];
    }
  }

  async purchasePackage(pkg: PurchasePackage): Promise<CustomerInfo | null> {
    if (!this.isInitialized || !this.Purchases) return null;

    try {
      const { customerInfo } = await this.Purchases.purchasePackage(pkg);
      return customerInfo;
    } catch (error: unknown) {
      if (error.userCancelled) {
        console.log('User cancelled purchase');
      } else {
        console.error('Failed to purchase package:', error);
      }
      return null;
    }
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    if (!this.isInitialized || !this.Purchases) return null;

    try {
      const customerInfo = await this.Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return null;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.isInitialized || !this.Purchases) return null;

    try {
      const customerInfo = await this.Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  async logIn(userId: string): Promise<void> {
    if (!this.isInitialized || !this.Purchases) return;

    try {
      await this.Purchases.logIn(userId);
    } catch (error) {
      console.error('Failed to log in user:', error);
    }
  }

  async logOut(): Promise<void> {
    if (!this.isInitialized || !this.Purchases) return;

    try {
      await this.Purchases.logOut();
    } catch (error) {
      console.error('Failed to log out user:', error);
    }
  }
}

export const monetizationService = new MonetizationService();
