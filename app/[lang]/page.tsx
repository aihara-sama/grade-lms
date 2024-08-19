"use client";

import BaseModal from "@/components/common/modals/base-modal";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const Cmp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (isOpen) {
      // Delay focus slightly to ensure the element is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen((prev) => !prev)}>Toggle</button>
      <BaseModal
        isExpanded={false}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        title="Create course"
      >
        <input ref={inputRef} autoFocus />
      </BaseModal>
    </>
  );
};

const Page: NextPage = () => {
  return (
    <>
      <Cmp />
    </>
  );
};

export default Page;
