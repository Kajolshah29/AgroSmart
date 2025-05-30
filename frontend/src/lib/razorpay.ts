declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (amount: number, sellerAddress: string) => {
  try {
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
      headers: { 'Content-Type': 'application/json' },
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AgriSmart",
      description: "Purchase Produce",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch('/api/payment/verify-payment', {
          method: 'POST',
          body: JSON.stringify({
            ...response,
            sellerAddress,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await verifyRes.json();
        return data;
      },
      prefill: {
        name: "Buyer Name",
        email: "buyer@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
}; 