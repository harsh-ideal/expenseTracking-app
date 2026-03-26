import { useEffect, useState } from "react";
import { subscribeExpenses } from "../services/expenseService";
import { Expense } from "../types";

export const useExpenses = (uid: string | undefined) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    const unsubscribe = subscribeExpenses(uid, (data) => {
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, total, loading, error };
};
