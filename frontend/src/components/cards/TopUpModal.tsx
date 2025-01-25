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
      setAmount("");
      setIsCustomAmount(false);
      onClose();
    }
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
    setIsCustomAmount(false);
  };

  const newBalance = card.balance + (parseFloat(amount) || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Card">
      <div className="space-y-6">
        {/* Card Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
          <div className="p-2 bg-white dark:bg-dark-bg-secondary rounded-full">
            <CreditCardIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Card Number
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {card.cardNumber}
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Balance
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${card.balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-2 gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetAmount(preset)}
              className={`p-4 rounded-lg border transition-colors ${
                amount === preset.toString() && !isCustomAmount
                  ? "border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-400"
              }`}
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${preset}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top Up Amount
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Amount
            </p>
            <button
              type="button"
              onClick={() => setIsCustomAmount(true)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Enter custom amount
            </button>
          </div>
          {isCustomAmount && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
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
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method
          </p>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center space-x-3 bg-white dark:bg-dark-bg-secondary">
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                •••• 4242
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expires 12/24
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 dark:bg-dark-bg-tertiary p-4 rounded-lg">
            <div className="flex justify-between">
              <p className="text-gray-500 dark:text-gray-400">Top Up Amount</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${amount || "0.00"}
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-gray-500 dark:text-gray-400">New Balance</p>
              <p className="font-medium text-gray-900 dark:text-white">
                ${newBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Top Up Card
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
