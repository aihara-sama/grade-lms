"use client";

import CrossEyeIcon from "@/components/icons/cross-eye-icon";
import EyeIcon from "@/components/icons/eye-icon";
import type { FunctionComponent, InputHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  Icon: JSX.Element;
  label?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  className?: string;
  fullWIdth?: boolean;
}

const Input: FunctionComponent<Props> = ({
  Icon,
  type,
  label,
  value,
  fullWIdth,
  placeholder,
  className = "",
  onClick,
  ...inputProps
}) => {
  const [inputType, setInputType] = useState(type);
  const inputRef = useRef<HTMLInputElement>();

  const handleToggleVisibility = () => {
    setInputType((prevType) => (prevType === "password" ? "text" : "password"));
  };

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
          {Icon}
        </div>
        <input
          ref={inputRef}
          value={value}
          type={inputType}
          placeholder={placeholder}
          className={fullWIdth ? "w-full" : "w-full sm:w-auto"}
          {...inputProps}
        />
        {type === "password" && (
          <div className="absolute top-2/4 flex *:translate-y-[-50%] right-1">
            <button
              type="button"
              className="icon-button"
              onClick={handleToggleVisibility}
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
