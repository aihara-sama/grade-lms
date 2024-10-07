"use client";

const Page = () => {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? "server" : "client"}
    </div>
  );
};

export default Page;
