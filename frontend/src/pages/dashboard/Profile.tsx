// src/pages/Profile.tsx
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  CameraIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  UserCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { AddCardModal } from "../../components/cards/AddCardModal";
import { format } from "date-fns";
import { Card } from "../../components/ui/Card";

const stationMap: { [key: number]: string } = {
  0: "Monib",
  1: "Mekky",
  2: "Om Masryen",
  3: "Giza",
  4: "Faisal",
  5: "Cairouni",
  6: "Behos",
  7: "Dokki",
  8: "Opera",
  9: "Sadat",
  10: "Naguib",
};

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Add new state for transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        // Convert file to base64 string
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            // TODO: Implement profile picture update logic
            toast.success("Profile picture updated successfully");
          } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update profile picture");
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("File reading error:", error);
        toast.error("Failed to process image");
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Implement profile update logic
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = (cardData: {
    cardNumber: string;
    userName: string;
    expiryDate: string;
    balance: number;
  }) => {
    // TODO: Implement card addition logic
    toast.success("Card added successfully");
    setShowAddCardModal(false);
  };

  const inputClasses =
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center";
  const iconClasses = "h-4 w-4 mr-2 text-gray-400 dark:text-gray-500";
  const textClasses =
    "mt-1 text-sm text-gray-900 dark:text-white flex items-center";

  // Modify useEffect to remove auth token requirement
  useEffect(() => {
    const fetchCards = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/home/cards/user/cards', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error('Error fetching cards:', error);
            toast.error('Failed to load RFID cards');
        } finally {
            setCardsLoading(false);
        }
    };

    fetchCards();
  }, []);

  // Add useEffect to fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/profile/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData({
          fullName: data.fullName,
          email: data.email,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile information');
      }
    };

    fetchProfileData();
  }, []);

  // Add useEffect to fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/finances/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.slice(0, 5)); // Only show latest 5 transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load recent activity');
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your personal information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Information */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className={labelClasses}>
                  <UserCircleIcon className={iconClasses} />
                  Full Name
                </label>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  {profileData.fullName || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <label className={labelClasses}>
                  <EnvelopeIcon className={iconClasses} />
                  Email
                </label>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  {profileData.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Your RFID Cards
            </h3>
            <Button
              onClick={() => setShowAddCardModal(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </div>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="dark:text-primary-400">Card Number</TableHead>
                  <TableHead className="dark:text-primary-400">Balance</TableHead>
                  <TableHead className="dark:text-primary-400">Status</TableHead>
                  <TableHead className="dark:text-primary-400">Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading cards...
                    </TableCell>
                  </TableRow>
                ) : cards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No cards found
                    </TableCell>
                  </TableRow>
                ) : (
                  cards.map((card) => (
                    <TableRow key={card.cardId}>
                      <TableCell>{card.cardId}</TableCell>
                      <TableCell>${card.balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            card.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {card.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {card.expiryDate ? format(new Date(card.expiryDate), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Activity Section */}
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {transactionsLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading activity...
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction._id} 
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.type === 'entry' ? 'Entry at ' : 'Exit from '} 
                        {stationMap[transaction.station] || transaction.station}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.date), "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.type === 'entry' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {transaction.type === 'entry' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <AddCardModal
          isOpen={showAddCardModal}
          onClose={() => setShowAddCardModal(false)}
          onAdd={handleAddCard}
        />
      )}
    </div>
  );
};
