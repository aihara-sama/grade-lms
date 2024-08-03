"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { FunctionComponent } from "react";

interface IProps {
  children: React.ReactNode;
  clientId: string;
}

const PaypalProvider: FunctionComponent<IProps> = ({ children, clientId }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": clientId,
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
