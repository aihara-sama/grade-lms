"use client";

import CrossEyeIcon from "@/components/icons/cross-eye-icon";
import EyeIcon from "@/components/icons/eye-icon";
import type {
  ForwardedRef,
  FunctionComponent,
  InputHTMLAttributes,
} from "react";
import { useState } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon: JSX.Element;
  fullWidth?: boolean;
  label?: string;
  bottomSpacing?: boolean;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  ref?: ForwardedRef<HTMLInputElement>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

const Input: FunctionComponent<IProps> = ({
  Icon,
  placeholder,
  fullWidth,
  label,
  bottomSpacing,
  value,
  onClick,
  ref,
  type,
  ...inputProps
}) => {
  const [inputType, setInputType] = useState(type);

  return (
    <div onClick={onClick} className={`${bottomSpacing ? "mb-3" : "ml-0"}`}>
      {label && <p className="mb-[6px]">{label}</p>}
      <div className="relative">
        <div className="absolute top-2/4 left-[14px] flex > *:translate-y-[-50%]">
          {Icon}
        </div>
        <input
          ref={ref}
          value={value}
          type={inputType}
          placeholder={placeholder}
          className={`${fullWidth ? "w-full" : "w-60"} border border-gray-500 pl-[34px] pr-[16px] py-[10px] rounded-[5px] text-sm`}
          {...inputProps}
        />
        {type === "password" && (
          <div className="absolute top-2/4 right-[6px] flex > *:translate-y-[-50%]">
            {inputType === "password" ? (
              <div className="icon-button" onClick={() => setInputType("text")}>
                <EyeIcon />
              </div>
            ) : (
              <div
                className="icon-button"
                onClick={() => setInputType("password")}
              >
                <CrossEyeIcon />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
export const CustomInput = (
  props: React.HTMLProps<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>
) => {
  return <input ref={ref} {...props} />;
};
