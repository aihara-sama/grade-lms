import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import PaypalProvider from "@/components/providers/paypal-provider";
import ProgressBar from "@/components/utilities/pregress-bar";
import "@/styles/globals.css";
import { Lato } from "next/font/google";
import type { FunctionComponent, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

const latoFont = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

interface Props {
  params: { locale: string };
}

const Layout: FunctionComponent<PropsWithChildren<Props>> = async ({
  children,
  params: { locale },
}) => {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <link
          rel="prefetch"
          href="/assets/gif/loading-spinner.gif"
          as="image"
        />
        <link rel="prefetch" href="/assets/svg/bubbled-bg.svg" as="image" />
        <link rel="prefetch" href="/assets/svg/chart-skeleton.svg" as="image" />
      </head>
      <body className={`${latoFont.className}`}>
        <NextIntlClientProvider messages={messages}>
          <PaypalProvider>
            {children}
            <Toaster position="top-right" />
            <ProgressBar />
          </PaypalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default Layout;
