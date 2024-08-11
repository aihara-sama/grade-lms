import "@/styles/globals.css";

import ProgressBar from "@/components/pregress-bar";
import PaypalProvider from "@/components/providers/paypal-provider";
import { Lato } from "next/font/google";
import { Toaster } from "react-hot-toast";

const latoFont = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${latoFont.className}`}>
        <PaypalProvider clientId={process.env.PAYPAL_CLIENT_ID}>
          {children}
          <Toaster />
          <ProgressBar />
        </PaypalProvider>
      </body>
    </html>
  );
}
