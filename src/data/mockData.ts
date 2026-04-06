import { subDays, formatISO } from "date-fns";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  name: string;
}

const today = new Date();

export const mockTransactions: Transaction[] = [
  { id: "t0", date: formatISO(today), amount: 45.5, category: "Food & Dining", type: "expense", name: "Uber Eats" },
  { id: "t1", date: formatISO(subDays(today, 1)), amount: 120.5, category: "Food & Dining", type: "expense", name: "Whole Foods" },
  { id: "t2", date: formatISO(subDays(today, 2)), amount: 3500, category: "Salary", type: "income", name: "NovaTech Inc." },
  { id: "t3", date: formatISO(subDays(today, 3)), amount: 45.0, category: "Transportation", type: "expense", name: "Uber" },
  { id: "t4", date: formatISO(subDays(today, 5)), amount: 1200, category: "Housing", type: "expense", name: "Rent" },
  { id: "t5", date: formatISO(subDays(today, 6)), amount: 15.99, category: "Entertainment", type: "expense", name: "Netflix" },
  { id: "t6", date: formatISO(subDays(today, 7)), amount: 200, category: "Shopping", type: "expense", name: "Amazon" },
  { id: "t7", date: formatISO(subDays(today, 8)), amount: 65.2, category: "Food & Dining", type: "expense", name: "Starbucks" },
  { id: "t8", date: formatISO(subDays(today, 12)), amount: 500, category: "Freelance", type: "income", name: "Upwork Client" },
  { id: "t9", date: formatISO(subDays(today, 15)), amount: 80, category: "Utilities", type: "expense", name: "Electric Bill" },
  { id: "t10", date: formatISO(subDays(today, 16)), amount: 120, category: "Health", type: "expense", name: "Pharmacy" },
  { id: "t11", date: formatISO(subDays(today, 18)), amount: 55, category: "Transportation", type: "expense", name: "Gas Station" },
  { id: "t12", date: formatISO(subDays(today, 20)), amount: 320, category: "Shopping", type: "expense", name: "Apple Store" },
  { id: "t13", date: formatISO(subDays(today, 22)), amount: 95, category: "Food & Dining", type: "expense", name: "Trader Joe's" },
  { id: "t14", date: formatISO(subDays(today, 25)), amount: 250, category: "Entertainment", type: "expense", name: "Concert Tickets" },
  { id: "t15", date: formatISO(subDays(today, 28)), amount: 3500, category: "Salary", type: "income", name: "NovaTech Inc." },
  { id: "t16", date: formatISO(subDays(today, 29)), amount: 1200, category: "Housing", type: "expense", name: "Rent" },
];
