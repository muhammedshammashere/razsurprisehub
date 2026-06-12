const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = async ({ keyId, razorpayOrderId, amount, orderId, user, onSuccess, onFailure }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Razorpay SDK failed to load');

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount,
      currency: 'INR',
      name: 'Raz Surprise Hub',
      description: 'Gift box order payment',
      order_id: razorpayOrderId,
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: '#ec407a' },
      handler: async (response) => {
        try {
          await onSuccess({
            orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(response);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure?.('Payment cancelled');
          reject(new Error('Payment cancelled'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};
