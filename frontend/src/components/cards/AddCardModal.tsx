// src/components/cards/AddCardModal.tsx
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardData: any) => void;
}

export const AddCardModal = ({ isOpen, onClose, onAdd }: AddCardModalProps) => {
  const [formData, setFormData] = useState({
    userId: "",
    initialBalance: "0",
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      initialBalance: parseFloat(formData.initialBalance),
      cardNumber: generateCardNumber(),
      status: "active",
      issueDate: new Date().toISOString(),
    });
    onClose();
  };

  const generateCardNumber = () => {
    return Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
    ).join("-");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Balance
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.initialBalance}
            onChange={(e) =>
              setFormData({ ...formData, initialBalance: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Card</Button>
        </div>
      </form>
    </Modal>
  );
};
