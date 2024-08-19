import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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

interface IProps {
  params: { locale: string };
}

const Layout: FunctionComponent<PropsWithChildren<IProps>> = async ({
  children,
  params: { locale },
}) => {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${latoFont.className}`}>
        <NextIntlClientProvider messages={messages}>
          <PaypalProvider>
            {children}
            <Toaster />
            <ProgressBar />
          </PaypalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default Layout;
