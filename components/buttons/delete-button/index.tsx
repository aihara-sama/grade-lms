"use client";

import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import { useState, type FunctionComponent } from "react";

interface IProps {
  record: string;
  action: (id: string) => Promise<{ error: string | null; data: null }>;
  id: string;
  onDone: () => void;
}

const DeleteButton: FunctionComponent<IProps> = ({
  record,
  action,
  id,
  onDone,
}) => {
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false);

  const closeModal = () => {
    setIsDeleteRecordModalOpen(false);
  };
  const openModal = () => {
    setIsDeleteRecordModalOpen(true);
  };

  const handleDeleteRecord = async () => {
    const { error } = await action(id);

    if (error) {
      toast(error);
    } else {
      toast(`${record[0].toUpperCase()}${record.slice(1)} deleted`);
      onDone();
      closeModal();
    }
  };
  return (
    <>
      <button className="primary-button w-auto" onClick={openModal}>
        Delete
      </button>

      <BaseModal
        isOpen={isDeleteRecordModalOpen}
        setIsOpen={setIsDeleteRecordModalOpen}
        title={`Delete ${record}`}
      >
        <p className="mb-4">Are you sure you want to delete this {record}?</p>
        <div className="flex justify-end gap-3">
          <button className="outline-button" onClick={closeModal}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleDeleteRecord}>
            Delete
          </button>
        </div>
      </BaseModal>
    </>
  );
};

export default DeleteButton;
