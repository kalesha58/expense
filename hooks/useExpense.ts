import { useState } from 'react';

import { expenseAPI } from '@/services/api';
import { insertExpense, initDatabase } from '@/services/sqlite';

export type ExpenseHeader = {
  title: string;
  purpose: string;
  expenseType: string;
  businessUnit: string;
  date: Date;
};

export type ReceiptFile = {
  uri: string;
  name?: string;
  mimeType?: string;
};

export type ExpenseLineItem = {
  id: string;
  date: Date;
  expenseType: string;
  merchant: string;
  amount: number;
  currency: string;
  projectCode: string;
  comments?: string;
  receipts?: ReceiptFile[];
};

type SaveMode = 'save' | 'create';

export const useExpense = () => {
  const [header, setHeader] = useState<ExpenseHeader>({
    title: '',
    purpose: '',
    expenseType: '',
    businessUnit: '',
    date: new Date(),
  });

  const [lineItems, setLineItems] = useState<ExpenseLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------
  // UTILS
  // -----------------
  const updateHeader = (updatedHeader: Partial<ExpenseHeader>) => {
    setHeader((prev) => ({ ...prev, ...updatedHeader }));
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  // -----------------
  // LINE ITEMS
  // -----------------
  const addLineItem = (lineItem: Omit<ExpenseLineItem, 'id'>) => {
    const newLineItem: ExpenseLineItem = {
      ...lineItem,
      id: generateUniqueId(),
    };
    setLineItems((prev) => [...prev, newLineItem]);
  };

  const updateLineItem = (id: string, updatedLineItem: Partial<ExpenseLineItem>) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedLineItem } : item))
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // -----------------
  // PERSISTENCE
  // -----------------
  const saveToSQLite = async () => {
    // await initDatabase();
    // await insertExpense(
    //   {
    //     title: header.title,
    //     purpose: header.purpose,
    //     expenseType: header.expenseType,
    //     businessUnit: header.businessUnit,
    //     date: header.date.toISOString(),
    //   },
    //   lineItems.map((item) => ({
    //     ...item,
    //     date: item.date.toISOString(),
    //     receipts: typeof item.receipts === 'string' ? [{ uri: item.receipts }] : item.receipts?.length ? item.receipts : undefined
    //   }))
    // );
  };

  const saveAsDraft = async () => {
    return handleSaveOrSubmit('save');
  };

  const submitReport = async () => {
    return handleSaveOrSubmit('create');
  };

  const handleSaveOrSubmit = async (mode: SaveMode) => {
    try {
      setIsLoading(true);
      setError(null);

      const reportData = {
        header,
        lineItems,
      };

      // API call for backend persistence
      // await expenseAPI.createExpenseReport(reportData, mode);

      // Local SQLite persistence for offline support / redundancy
      // await saveToSQLite(); // Temporarily commented out as requested
    } catch (err: any) {
      setError(err.message || `Failed to ${mode === 'save' ? 'save draft' : 'submit report'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------
  // RESET
  // -----------------
  const resetExpense = () => {
    setHeader({
      title: '',
      purpose: '',
      expenseType: '',
      businessUnit: '',
      date: new Date(),
    });
    setLineItems([]);
    setError(null);
  };

  return {
    header,
    lineItems,
    isLoading,
    error,
    updateHeader,
    addLineItem,
    updateLineItem,
    removeLineItem,
    saveAsDraft,
    submitReport,
    resetExpense,
  };
};
