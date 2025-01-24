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

// Sample data
const sampleCards: Card[] = [
  {
    id: "1",
    cardNumber: "6032-9174-8523-4561",
    userId: "sarah_ahmed",
    balance: 50.0,
    status: "active",
    issueDate: "2024-01-01",
    expiryDate: "2025-01-01",
    lastUsed: "2024-02-20",
  },
  {
    id: "2",
    cardNumber: "8145-7932-6541-2098",
    userId: "mohamed_hassan",
    balance: 0.0,
    status: "blocked",
    issueDate: "2023-11-15",
    expiryDate: "2024-11-15",
    lastUsed: "2024-02-01",
  },
  {
    id: "3",
    cardNumber: "4527-8916-3045-7829",
    userId: "nour_ibrahim",
    balance: 150.75,
    status: "inactive",
    issueDate: "2024-02-01",
    expiryDate: "2025-02-01",
    lastUsed: "2024-02-19",
  },
];

export const Cards = () => {
  const [cards, setCards] = useState<Card[]>(sampleCards);
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

  const handleAddCard = (cardData: any) => {
    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      ...cardData,
      lastUsed: new Date().toISOString(),
    };
    setCards([newCard, ...cards]);
    toast.success("Card added successfully");
  };

  const handleBlockCard = (cardId: string) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, status: "blocked" } : card
      )
    );
    toast.success("Card blocked successfully");
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
          card.userId.includes(searchTerm))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const handleTopUp = (cardId: string, amount: number) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            balance: card.balance + amount,
            transactions: [
              {
                id: Math.random().toString(36).substr(2, 9),
                cardId: card.id,
                amount: amount,
                type: "topup",
                station: "Online",
                timestamp: new Date().toISOString(),
                status: "completed",
                balance: card.balance + amount,
              },
              ...(card.transactions || []),
            ],
          };
        }
        return card;
      })
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFID Cards</h1>
          <p className="text-gray-500">Manage all RFID cards in the system</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Card
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
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              className="border rounded-lg px-4 py-2"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as Card["status"] | "all")
              }
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
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
                className="cursor-pointer"
                onClick={() => handleSort("cardNumber")}
              >
                <div className="flex items-center space-x-2">
                  <span>Card Number</span>
                  <ArrowsUpDownIcon className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Actions</TableHead>
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
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowConfirmBlock(true);
                      }}
                    >
                      Block
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
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCard}
      />

      {selectedCard && (
        <ViewCardModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
        />
      )}

      {/* Block Confirmation Modal */}
      <Modal
        isOpen={showConfirmBlock}
        onClose={() => setShowConfirmBlock(false)}
        title="Block Card"
      >
        <div className="space-y-4">
          <p>Are you sure you want to block this card?</p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. The card will be immediately blocked
            from all transactions.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmBlock(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (selectedCard) {
                  handleBlockCard(selectedCard.id);
                  setShowConfirmBlock(false);
                  setSelectedCard(null);
                }
              }}
            >
              Block Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
