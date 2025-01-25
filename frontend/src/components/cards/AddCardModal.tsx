// src/components/cards/AddCardModal.tsx
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { format, addYears } from "date-fns";
import toast from "react-hot-toast";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardData: {
    cardNumber: string;
    userName: string;
    expiryDate: string;
    balance: number;
  }) => void;
}

export const AddCardModal = ({ isOpen, onClose, onAdd }: AddCardModalProps) => {
  const [userName, setUserName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const defaultExpiryDate = format(addYears(new Date(), 1), "yyyy-MM-dd");
  const [expiryDate, setExpiryDate] = useState(defaultExpiryDate);

  const generateCardNumber = () => {
    const numbers = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10)
    );
    return numbers
      .join("")
      .match(/.{1,4}/g)!
      .join("-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userName || !initialBalance || !expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Generate a random card number
      const cardNumber = generateCardNumber();

      onAdd({
        cardNumber,
        userName,
        expiryDate,
        balance: parseFloat(initialBalance),
      });

      // Reset form
      setUserName("");
      setInitialBalance("");
      setExpiryDate(defaultExpiryDate);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Balance
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2  dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="block w-full rounded-md border border-gray-300 pl-8 pr-3 py-2"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
            required
          />
        </div>

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>A card number will be automatically generated upon submission.</p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              setUserName("");
              setInitialBalance("");
              setExpiryDate(defaultExpiryDate);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            Add Card
          </Button>
        </div>
      </form>
    </Modal>
  );
};
