'use client';
import { useCallback, useRef, useEffect } from 'react';

declare global {
  interface Window { Razorpay: any; }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { email?: string; contact?: string; name?: string };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
}

export function useRazorpay() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || typeof window === 'undefined') return;
    if (document.querySelector('script[src*="razorpay"]')) {
      loaded.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { loaded.current = true; };
    document.body.appendChild(script);
  }, []);

  const openPayment = useCallback((options: RazorpayOptions) => {
    if (!window.Razorpay) {
      options.onFailure?.({ reason: 'Razorpay SDK not loaded' });
      return;
    }

    const rzp = new window.Razorpay({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      order_id: options.order_id,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      handler: options.onSuccess,
      modal: { ondismiss: () => options.onFailure?.({ reason: 'dismissed' }) },
      theme: { color: '#8B6F5C' },
    });
    rzp.open();
  }, []);

  return { openPayment };
}
