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

// Sample transactions (in real app, this would come from API)
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    cardId: "1",
    amount: 2.5,
    type: "entry",
    station: "Central Station",
    timestamp: new Date().toISOString(),
    status: "completed",
    balance: 47.5,
  },
  {
    id: "2",
    cardId: "1",
    amount: 50.0,
    type: "topup",
    station: "Online",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    balance: 50.0,
  },
];

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "entry":
      case "exit":
        return "text-blue-600";
      case "topup":
        return "text-green-600";
      case "refund":
        return "text-yellow-600";
      default:
        return "text-gray-600";
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
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`${getTransactionColor(transaction.type)}`}>
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {transaction.type.charAt(0).toUpperCase() +
              transaction.type.slice(1)}
          </p>
          <p className="text-sm text-gray-500">{transaction.station}</p>
          <p className="text-xs text-gray-400">
            {format(new Date(transaction.timestamp), "MMM dd, yyyy HH:mm")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-medium ${
            transaction.type === "topup" || transaction.type === "refund"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {transaction.type === "topup" || transaction.type === "refund"
            ? "+"
            : "-"}
          ${transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
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
  const [transactions, setTransactions] = useState(sampleTransactions);
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

    // Update transactions
    setTransactions([newTransaction, ...transactions]);

    // Update card with new balance
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

  const filteredTransactions = transactions.filter((transaction) =>
    transactionFilter === "all" ? true : transaction.type === transactionFilter
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Card Details">
        <div className="space-y-6">
          {/* Card Header */}
          <div className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg">
            <div className="p-3 bg-primary-100 rounded-full">
              <CreditCardIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {card.cardNumber}
              </h3>
              <p className="text-sm text-gray-500">User ID: {card.userId}</p>
            </div>
          </div>

          {/* Card Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${card.balance.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={`inline-flex px-2 py-1 rounded-full text-sm ${
                  card.status === "active"
                    ? "bg-green-100 text-green-800"
                    : card.status === "inactive"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {card.status}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(card.issueDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(card.expiryDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Transaction History</h4>
              <select
                className="text-sm border rounded-md px-2 py-1"
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
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setShowTopUp(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Top Up
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
