"use client";

import { useState } from "react";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        onClick={openModal}
      >
        Open Modal
      </button>

      {/* Modal backdrop */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Modal container */}
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Modal Title
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            {/* Modal content */}
            <div className="text-gray-600 mb-6">
              <p>
                This modal is responsive not only in width but also handles
                different screen heights!
              </p>
              <p>
                When the content exceeds the screen height, it becomes
                scrollable inside the modal while keeping the modal centered.
              </p>
              <p>
                This ensures that the user experience remains smooth even on
                devices with limited screen space.
              </p>
              {/* Add more content to test scrolling */}
              <p className="mt-4">Scroll down for more...</p>
              <div className="h-40 bg-gray-100 mt-4 p-2 rounded">
                <p>Additional content here.</p>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Page = () => {
  return (
    <>
      <Modal />
    </>
  );
};

export default Page;
