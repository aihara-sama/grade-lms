import "@/styles/globals.css";

import ProgressBar from "@/components/pregress-bar";
import PaypalProvider from "@/components/providers/paypal-provider";
import { Lato } from "next/font/google";
import type { FunctionComponent, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const latoFont = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${latoFont.className}`}>
        <PaypalProvider>
          {children}
          <Toaster />
          <ProgressBar />
        </PaypalProvider>
      </body>
    </html>
  );
};

export default Layout;
