import NotFoundIcon from "@/components/icons/not-found-icon";
import clsx from "clsx";
import type { FunctionComponent, ReactNode } from "react";

interface Props {
  variant?: "primary" | "secondary";
  action: ReactNode;
}

const NotFound: FunctionComponent<Props> = ({
  action,
  variant = "primary",
}) => {
  return (
    <div
      className={`flex justify-center mb-4 ${clsx({
        "mt-12": variant === "primary",
        "mt-4": variant === "secondary",
        "min-h-[500px]": variant === "primary",
      })}`}
    >
      <div className="flex flex-col items-center">
        <NotFoundIcon
          {...(variant === "secondary" && { size: "xl" })}
          className={`${"mb-4"}`}
        />
        <p
          className={`${clsx(variant === "primary" && "text-xl")} text-center text-neutral-600 font-bold`}
        >
          No results found
        </p>
        {variant === "primary" && (
          <p className="text-sm text-center max-w-96 my-2 text-neutral-500">
            Try using different keywords or change some filters
          </p>
        )}
        {action}
      </div>
    </div>
  );
};

export default NotFound;
