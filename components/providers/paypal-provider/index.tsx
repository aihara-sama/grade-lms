"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { FunctionComponent, PropsWithChildren } from "react";

const PaypalProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "subscription",
        vault: true,
      }}
      deferLoading={true}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PaypalProvider;
