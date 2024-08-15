"use client";

import { useState } from "react";
import { usePopper } from "react-popper";

const PopperExample: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <div>
      <button
        ref={setReferenceElement}
        onClick={() => setIsVisible(!isVisible)}
      >
        Toggle Popper
      </button>
      {isVisible && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="p-2 bg-gray-700 text-white rounded">
            I am a popper!
          </div>
        </div>
      )}
    </div>
  );
};
const Page = () => {
  return <PopperExample />;
};

export default Page;
