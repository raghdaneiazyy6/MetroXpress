// src/types/common.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "staff";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export interface Card {
  id: string;
  cardNumber: string;
  userId: string;
  balance: number;
  status: "active" | "inactive" | "blocked";
  issueDate: string;
  expiryDate: string;
  lastUsed: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  type: "entry" | "exit" | "topup" | "refund";
  station: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  balance: number; // Balance after transaction
}
