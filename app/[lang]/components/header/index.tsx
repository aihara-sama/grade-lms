import Logo from "@/components/common/logo";
import type { PropsWithClassName } from "@/types/props.type";
import Link from "next/link";
import type { FunctionComponent } from "react";

const Header: FunctionComponent<PropsWithClassName> = ({ className }) => {
  return (
    <header className={`p-4 flex justify-between ${className}`}>
      <Logo />
      <Link className="button link-button" href="/sign-up">
        Sign Up
      </Link>
    </header>
  );
};

export default Header;
