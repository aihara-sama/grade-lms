import type { PropsWithClassName } from "@/types/props.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Footer: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <footer className={`${className} bg-link py-9`}>
      <h1 className="text-white text-2xl font-bold text-center mb-4">
        Join Our Learning Platform Today!
      </h1>
      <p className="text-center text-white text-sm mb-5">
        Join for free and start your training journey
      </p>
      <div className="flex justify-center">
        <Link href="/sign-up" className="button bg-white text-link">
          Get started
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
