// src/components/cards/ViewCardModal.tsx
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Card, Transaction } from "../../types/common";
import { TopUpModal } from "./TopUpModal";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface ViewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onUpdate: (updatedCard: Card) => void;
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "entry":
      case "exit":
        return "text-blue-600 dark:text-blue-400";
      case "topup":
        return "text-green-600 dark:text-green-400";
      case "refund":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-300";
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "entry":
        return <ArrowDownIcon className="w-5 h-5" />;
      case "exit":
        return <ArrowUpIcon className="w-5 h-5" />;
      case "topup":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "refund":
        return <ExclamationCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`${getTransactionColor(transaction.type)}`}>
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {transaction.type.charAt(0).toUpperCase() +
              transaction.type.slice(1)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {transaction.station}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {format(new Date(transaction.timestamp), "MMM dd, yyyy HH:mm")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-medium ${
            transaction.type === "topup" || transaction.type === "refund"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {transaction.type === "topup" || transaction.type === "refund"
            ? "+"
            : "-"}
          ${transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Balance: ${transaction.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export const ViewCardModal = ({
  isOpen,
  onClose,
  card,
  onUpdate,
}: ViewCardModalProps) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState("all");

  const handleTopUp = (amount: number) => {
    const newBalance = card.balance + amount;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      cardId: card.id,
      amount: amount,
      type: "topup",
      station: "Online",
      timestamp: new Date().toISOString(),
      status: "completed",
      balance: newBalance,
    };

    // Update card with new balance and transaction
    const updatedCard = {
      ...card,
      balance: newBalance,
      transactions: [newTransaction, ...(card.transactions || [])],
    };
    onUpdate(updatedCard);

    // Show success message
    toast.success(`Successfully topped up $${amount.toFixed(2)}`);
    setShowTopUp(false);
  };

  const filteredTransactions = (card.transactions || []).filter((transaction) =>
    transactionFilter === "all" ? true : transaction.type === transactionFilter
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Card Details">
        <div className="space-y-4">
          {/* Card Header */}
          <div className="flex items-center space-x-4 p-4 bg-primary-50 dark:bg-dark-bg-tertiary rounded-lg">
            <div className="p-3 bg-primary-100 dark:bg-dark-bg-secondary rounded-full">
              <CreditCardIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {card.cardNumber}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User Name: {card.userId}
              </p>
            </div>
          </div>

          {/* Card Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Balance */}
            <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Balance
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ${card.balance.toFixed(2)}
              </p>
            </div>
            {/* Status */}
            <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p
                className={`inline-flex px-2 py-1 rounded-full text-sm ${
                  card.status === "active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    : card.status === "inactive"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                }`}
              >
                {card.status}
              </p>
            </div>
            {/* Issue Date */}
            <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Issue Date
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {format(new Date(card.issueDate), "MMM dd, yyyy")}
              </p>
            </div>
            {/* Expiry Date */}
            <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expiry Date
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {format(new Date(card.expiryDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Transaction History
              </h4>
              <select
                className="text-sm border rounded-md px-2 py-1 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="entry">Entries</option>
                <option value="exit">Exits</option>
                <option value="topup">Top-ups</option>
                <option value="refund">Refunds</option>
              </select>
            </div>
            <div className="space-y-1 h-[240px] overflow-y-auto scrollbar-hide">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => setShowTopUp(true)}
              className="flex flex-row-reverse items-center"
            >
              Top Up
              <PlusIcon className="h-5 w-5 mr-2" />
            </Button>
          </div>
        </div>
      </Modal>

      <TopUpModal
        isOpen={showTopUp}
        onClose={() => setShowTopUp(false)}
        card={card}
        onTopUp={handleTopUp}
      />
    </>
  );
};
