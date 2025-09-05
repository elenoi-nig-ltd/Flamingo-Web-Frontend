'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PaymentCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get('status');
    const txRef = searchParams.get('tx_ref');
    const transactionId = searchParams.get('transaction_id');

    console.log('Payment callback received:', { status, txRef, transactionId });

    const handlePaymentSuccess = async () => {
      try {
        // Get stored order data
        const storedOrderData = sessionStorage.getItem('pendingOrder');
        
        if (!storedOrderData) {
          console.error('No pending order data found');
          alert('Payment successful! Order data not found.');
          router.push('/food');
          return;
        }

        const orderData = JSON.parse(storedOrderData);
        
        // Verify transaction reference matches
        if (orderData.tx_ref !== txRef) {
          console.error('Transaction reference mismatch');
          alert('Payment verification failed. Please contact support.');
          router.push('/food');
          return;
        }

        // Record the order in your backend
        const response = await fetch('/api/orders/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: orderData.userId,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            transactionId: transactionId,
            txRef: txRef
          })
        });

        const result = await response.json();

        if (result.success) {
          // Clear stored order data
          sessionStorage.removeItem('pendingOrder');
          alert(`Payment successful! Order recorded. Transaction reference: ${txRef}`);
        } else {
          console.error('Failed to record order:', result.error);
          alert('Payment successful but order recording failed. Please contact support.');
        }
      } catch (error) {
        console.error('Error recording order:', error);
        alert('Payment successful but order recording failed. Please contact support.');
      }
      
      router.push('/food');
    };

    if (status === 'successful' || status === 'completed') {
      handlePaymentSuccess();
    } else if (status === 'cancelled') {
      // Clear stored order data on cancellation
      sessionStorage.removeItem('pendingOrder');
      alert('Payment was cancelled');
      router.push('/food');
    } else if (status === 'failed') {
      // Clear stored order data on failure
      sessionStorage.removeItem('pendingOrder');
      alert('Payment failed. Please try again.');
      router.push('/food');
    } else {
      // Handle unknown status
      console.log('Unknown payment status:', status);
      alert('Payment status unclear. Please check your order status.');
      router.push('/food');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Processing Payment...
        </h1>
        <p className="text-gray-600">
          Please wait while we confirm your payment.
        </p>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
