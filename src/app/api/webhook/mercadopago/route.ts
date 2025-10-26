import { NextRequest, NextResponse } from 'next/server';
import { getPayment } from '@/lib/mercadopago/client';
import { createClient } from '@/lib/supabase/server';

/**
 * MercadoPago Webhook Handler
 * Handles IPN notifications from MercadoPago
 *
 * Webhook URL: https://yourdomain.com/api/webhook/mercadopago
 *
 * Important: Configure this URL in your MercadoPago application settings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MercadoPago sends different types of notifications
    const { type, data } = body;

    console.log('MercadoPago webhook received:', { type, data });

    // Handle payment notifications
    if (type === 'payment') {
      const paymentId = data.id;

      // Get full payment details
      const payment = await getPayment(paymentId);

      // Extract metadata
      const userId = payment.metadata?.user_id;
      const subscriptionTier = payment.metadata?.subscription_tier;

      if (!userId) {
        console.error('No user_id in payment metadata');
        return NextResponse.json(
          { error: 'Invalid payment metadata' },
          { status: 400 }
        );
      }

      // Update user subscription based on payment status
      const supabase = await createClient();

      switch (payment.status) {
        case 'approved':
          // Payment approved - activate subscription
          await supabase
            .from('profiles')
            .update({
              subscription_tier: subscriptionTier || 'pro',
              subscription_status: 'active',
              mercadopago_customer_id: payment.payer?.id,
            })
            .eq('id', userId);

          console.log(`Subscription activated for user ${userId}`);
          break;

        case 'pending':
          // Payment pending - maybe waiting for bank transfer
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'pending',
            })
            .eq('id', userId);

          console.log(`Payment pending for user ${userId}`);
          break;

        case 'rejected':
        case 'cancelled':
          // Payment failed
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'inactive',
            })
            .eq('id', userId);

          console.log(`Payment failed for user ${userId}`);
          break;

        default:
          console.log(`Unhandled payment status: ${payment.status}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// MercadoPago also sends GET requests to verify the webhook URL
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
