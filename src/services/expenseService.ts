import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Expense, ExpenseCategory } from "../types";

const expensesRef = (uid: string) =>
  collection(db, "users", uid, "expenses");

// Add a new expense
export const addExpense = async (
  uid: string,
  data: { amount: number; category: ExpenseCategory; note: string }
): Promise<void> => {
  await addDoc(expensesRef(uid), {
    ...data,
    uid,
    createdAt: Timestamp.now().toMillis(),
  });
};

// One-time fetch of all expenses
export const getExpenses = async (uid: string): Promise<Expense[]> => {
  const q = query(expensesRef(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Expense, "id">),
  }));
};

// Real-time listener
export const subscribeExpenses = (
  uid: string,
  callback: (expenses: Expense[]) => void
): Unsubscribe => {
  const q = query(expensesRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, "id">),
    }));
    callback(expenses);
  });
};
