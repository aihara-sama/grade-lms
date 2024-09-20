"use client";

import CrossEyeIcon from "@/components/icons/cross-eye-icon";
import EyeIcon from "@/components/icons/eye-icon";
import type { PropsWithClassName } from "@/types/props.type";
import clsx from "clsx";
import type {
  FunctionComponent,
  InputHTMLAttributes,
  MouseEventHandler,
} from "react";
import { useEffect, useRef, useState } from "react";
import { setTimeout } from "timers";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  label?: string;
  value?: string;
  EndIcon?: JSX.Element;
  StartIcon: JSX.Element;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const Input: FunctionComponent<PropsWithClassName<Props>> = ({
  StartIcon,
  EndIcon,
  type,
  label,
  value,
  fullWidth,
  placeholder,
  className = "",
  onClick,
  ...inputProps
}) => {
  const [inputType, setInputType] = useState(type);
  const inputRef = useRef<HTMLInputElement>();

  const onEyeIconClick = () =>
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));

  useEffect(() => {
    if (inputProps.autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, []);

  return (
    <div onClick={onClick} className={`mb-3 ${className}`}>
      {label && (
        <p className="mb-1 text-sm font-bold text-neutral-500">{label}</p>
      )}
      <div className="relative">
        <div className="absolute top-2/4 flex *:translate-y-[-50%] left-3 text-neutral-600">
          {StartIcon}
        </div>
        {EndIcon && (
          <div className="absolute top-2/4 flex *:translate-y-[-50%] right-3 text-neutral-600">
            {EndIcon}
          </div>
        )}
        <input
          ref={inputRef}
          value={value}
          type={inputType}
          placeholder={placeholder}
          className={` w-full ${clsx({ "pr-10": EndIcon, "sm:w-auto": !fullWidth })}`}
          {...inputProps}
        />
        {type === "password" && (
          <div className="absolute top-2/4 flex *:translate-y-[-50%] right-1">
            <button
              type="button"
              className="icon-button"
              onClick={onEyeIconClick}
            >
              {inputType === "password" ? <EyeIcon /> : <CrossEyeIcon />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
