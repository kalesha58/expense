import { useState } from 'react';
import { expenseAPI } from '@/services/api';

export type ExpenseHeader = {
  title: string;
  purpose: string;
  expenseType: string;
  businessUnit: string;
  date: Date;
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
  receipt?: string;
};

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
  
  const updateHeader = (updatedHeader: Partial<ExpenseHeader>) => {
    setHeader(prev => ({ ...prev, ...updatedHeader }));
  };
  
  const addLineItem = (lineItem: Omit<ExpenseLineItem, 'id'>) => {
    const newLineItem = {
      ...lineItem,
      id: Date.now().toString(), // Generate a temporary ID
    };
    
    setLineItems(prev => [...prev, newLineItem]);
  };
  
  const updateLineItem = (id: string, updatedLineItem: Partial<ExpenseLineItem>) => {
    setLineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updatedLineItem } : item
      )
    );
  };
  
  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };
  
  const saveAsDraft = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const reportData = {
        header,
        lineItems,
      };
      
      const response = await expenseAPI.createExpenseReport(reportData, 'save');
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to save expense report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const submitReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const reportData = {
        header,
        lineItems,
      };
      
      const response = await expenseAPI.createExpenseReport(reportData, 'create');
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
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