import type { PropsWithClassName } from "@/types/props.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Hero: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <section className={`${className} container`}>
      <div className="flex justify-center">
        <h1 className="text-neutral-600 text-4xl font-bold text-center mb-5 max-w-[480px]">
          Live lessons, users and courses management
        </h1>
      </div>
      <p className="text-center text-neutral-500 text-lg mb-10">
        Revolutionize your training experience
      </p>
      <div className="flex justify-center">
        <Link href="/sign-up" className="button link-button px-6">
          Get started
        </Link>
      </div>
    </section>
  );
};

export default Hero;
