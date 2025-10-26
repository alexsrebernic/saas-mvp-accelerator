import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

/**
 * Create a payment preference for MercadoPago
 * @param items - Items to be paid
 * @param metadata - Additional metadata (user_id, subscription_tier, etc.)
 * @returns Preference ID and init_point (payment URL)
 */
export async function createPaymentPreference({
  items,
  metadata,
  backUrls,
}: {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  metadata?: Record<string, any>;
  backUrls?: {
    success: string;
    failure: string;
    pending: string;
  };
}) {
  try {
    const preference = await preferenceClient.create({
      body: {
        items: items.map(item => ({
          ...item,
          currency_id: item.currency_id || 'ARS', // Default to ARS for Argentina
        })),
        metadata,
        back_urls: backUrls || {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
        },
        auto_return: 'approved' as const,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago`,
      },
    });

    return {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    };
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw error;
  }
}

/**
 * Get payment information
 * @param paymentId - Payment ID from MercadoPago
 */
export async function getPayment(paymentId: string) {
  try {
    const payment = await paymentClient.get({ id: paymentId });
    return payment;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw error;
  }
}

/**
 * Example: Create subscription preference (monthly)
 */
export async function createSubscriptionPreference({
  userId,
  plan,
  amount,
}: {
  userId: string;
  plan: 'pro' | 'enterprise';
  amount: number;
}) {
  return createPaymentPreference({
    items: [
      {
        title: `Suscripción ${plan === 'pro' ? 'Pro' : 'Enterprise'}`,
        quantity: 1,
        unit_price: amount,
        currency_id: 'ARS',
      },
    ],
    metadata: {
      user_id: userId,
      subscription_tier: plan,
      type: 'subscription',
    },
  });
}
