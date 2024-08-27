import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import ProgressBar from "@/components/pregress-bar";
import PaypalProvider from "@/components/providers/paypal-provider";
import "@/styles/globals.css";
import { Lato } from "next/font/google";
import type { FunctionComponent, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <Toaster position="bottom-right" />
            <ToastContainer />
            <ProgressBar />
          </PaypalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default Layout;
