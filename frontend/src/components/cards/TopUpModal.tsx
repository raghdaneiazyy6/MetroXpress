// src/components/cards/TopUpModal.tsx
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Card } from "../../types/common";
import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onTopUp: (amount: number) => void;
}

const PRESET_AMOUNTS = [10, 20, 50, 100];

export const TopUpModal = ({
  isOpen,
  onClose,
  card,
  onTopUp,
}: TopUpModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onTopUp(numAmount);
      onClose();
    }
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
    setIsCustomAmount(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Card">
      <div className="space-y-6">
        {/* Card Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="p-2 bg-white rounded-full">
            <CreditCardIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Card Number</p>
            <p className="font-medium">{card.cardNumber}</p>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="font-medium">${card.balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-2 gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetAmount(preset)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                amount === preset.toString() && !isCustomAmount
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-primary-600"
              }`}
            >
              <div className="text-center">
                <p className="text-2xl font-bold">${preset}</p>
                <p className="text-sm text-gray-500">Top Up Amount</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Custom Amount</p>
            <button
              onClick={() => setIsCustomAmount(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Enter custom amount
            </button>
          </div>
          {isCustomAmount && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </p>
          <div className="p-4 border rounded-lg flex items-center space-x-3">
            <div className="w-12 h-8 bg-gray-200 rounded"></div>
            <div>
              <p className="font-medium">•••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/24</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <p className="text-gray-500">Top Up Amount</p>
              <p className="font-medium">${amount || "0.00"}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-gray-500">New Balance</p>
              <p className="font-medium">
                ${((card.balance || 0) + parseFloat(amount || "0")).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!amount || parseFloat(amount) <= 0}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Top Up Card
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
