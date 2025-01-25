// src/pages/dashboard/Cards.tsx
import { useState } from "react";
import { Card as CardComponent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import {
  CreditCardIcon,
  PlusIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../types/common";
import { format } from "date-fns";
import { AddCardModal } from "../../components/cards/AddCardModal";
import { ViewCardModal } from "../../components/cards/ViewCardModal";
import { toast } from "react-hot-toast";
import { mockCards } from "../../mocks/cardData";

export const Cards = () => {
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Card["status"] | "all">(
    "all"
  );
  const [sortField, setSortField] = useState<keyof Card>("cardNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleSort = (field: keyof Card) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddCard = (cardData: {
    cardNumber: string;
    userName: string;
    expiryDate: string;
    balance: number;
  }) => {
    try {
      const newCard: Card = {
        id: Math.random().toString(36).substr(2, 9),
        cardNumber: cardData.cardNumber,
        userId: cardData.userName.toLowerCase().replace(/\s+/g, "_"),
        balance: cardData.balance,
        status: "active",
        issueDate: new Date().toISOString(),
        expiryDate: cardData.expiryDate,
        lastUsed: "",
        transactions: [],
      };

      setCards((prevCards) => {
        const updatedCard = checkCardStatus(newCard);
        return [updatedCard, ...prevCards];
      });

      toast.success("Card added successfully");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    }
  };

  const handleUpdateCard = (updatedCard: Card) => {
    setCards(
      cards.map((card) =>
        card.id === updatedCard.id ? checkCardStatus(updatedCard) : card
      )
    );
  };

  const handleBlockCard = (cardId: string) => {
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              status: card.status === "blocked" ? "active" : "blocked",
              transactions: [
                {
                  id: Math.random().toString(36).substr(2, 9),
                  cardId: card.id,
                  amount: 0,
                  type: "exit",
                  station: "System",
                  timestamp: new Date().toISOString(),
                  status: "completed",
                  balance: card.balance,
                },
                ...(card.transactions || []),
              ],
            }
          : card
      )
    );
    toast.success(
      `Card ${
        cards.find((c) => c.id === cardId)?.status === "blocked"
          ? "unblocked"
          : "blocked"
      } successfully`
    );
  };

  const checkCardStatus = (card: Card): Card => {
    if (card.balance < 20 && card.status !== "blocked") {
      return {
        ...card,
        status: "inactive",
      };
    }
    return card;
  };

  const handleViewCard = (card: Card) => {
    setSelectedCard(card);
    setShowViewModal(true);
  };

  const filteredCards = cards
    .filter(
      (card) =>
        (filterStatus === "all" || card.status === filterStatus) &&
        (card.cardNumber.includes(searchTerm) ||
          card.userId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            RFID Cards
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all RFID cards in the system
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex flex-row-reverse items-center"
        >
          Add New Card
          <PlusIcon className="h-4 w-4 mr-2" />
        </Button>
      </div>

      {/* Filters and Search */}
      <CardComponent className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cards..."
                className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              className="border rounded-lg px-4 py-2 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as Card["status"] | "all")
              }
            >
              <option
                value="all"
                className="bg-white dark:bg-dark-bg-secondary"
              >
                All Status
              </option>
              <option
                value="active"
                className="bg-white dark:bg-dark-bg-secondary"
              >
                Active
              </option>
              <option
                value="inactive"
                className="bg-white dark:bg-dark-bg-secondary"
              >
                Inactive
              </option>
              <option
                value="blocked"
                className="bg-white dark:bg-dark-bg-secondary"
              >
                Blocked
              </option>
            </select>
          </div>
        </div>
      </CardComponent>

      {/* Cards Table */}
      <CardComponent className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer dark:text-primary-400"
                onClick={() => handleSort("cardNumber")}
              >
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span>Card Number</span>
                  <ArrowsUpDownIcon className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead className="dark:text-primary-400">Balance</TableHead>
              <TableHead className="dark:text-primary-400">Status</TableHead>
              <TableHead className="dark:text-primary-400">
                Issue Date
              </TableHead>
              <TableHead className="dark:text-primary-400">
                Expiry Date
              </TableHead>
              <TableHead className="dark:text-primary-400">Last Used</TableHead>
              <TableHead className="dark:text-primary-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>{card.cardNumber}</TableCell>
                <TableCell>${card.balance.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      card.status === "active"
                        ? "bg-green-100 text-green-800"
                        : card.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.status}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(card.issueDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(card.expiryDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(card.lastUsed), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        card.status === "blocked" ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowConfirmBlock(true);
                      }}
                    >
                      {card.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCard(card)}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardComponent>

      {/* Modals */}
      {showAddModal && ( // Only render when showAddModal is true
        <AddCardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCard}
        />
      )}

      {selectedCard && (
        <ViewCardModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
          onUpdate={handleUpdateCard}
        />
      )}

      {/* Block Confirmation Modal */}
      <Modal
        isOpen={showConfirmBlock}
        onClose={() => setShowConfirmBlock(false)}
        title={`${
          selectedCard?.status === "blocked" ? "Unblock" : "Block"
        } Card`}
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to{" "}
            {selectedCard?.status === "blocked" ? "unblock" : "block"} this
            card?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedCard?.status === "blocked"
              ? "This will allow the card to be used for transactions again."
              : "This action will prevent the card from being used in any transactions."}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmBlock(false)}
            >
              Cancel
            </Button>
            <Button
              variant={
                selectedCard?.status === "blocked" ? "primary" : "danger"
              }
              onClick={() => {
                if (selectedCard) {
                  handleBlockCard(selectedCard.id);
                  setShowConfirmBlock(false);
                  setSelectedCard(null);
                }
              }}
            >
              {selectedCard?.status === "blocked" ? "Unblock" : "Block"} Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
