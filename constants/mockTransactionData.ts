export type TransactionStatus = 'synced' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  title: string;
  date: string;
  synced: boolean;
  local: boolean;
  reportTitle: string;
  amount: string;
  status: TransactionStatus;
  apiEndpoint?: string;
  errorMessage?: string;
};

export const mockTransactionHistory: Transaction[] = [
  {
    id: '1',
    title: 'Create Expense Report API',
    date: 'July 16, 2025 - 10:45 AM',
    synced: true,
    local: true,
    reportTitle: 'Sales Trip Q2',
    amount: 'USD 450.00',
    status: 'synced',
    apiEndpoint: '/EBS/23B/createExpenseReport',
  },
  {
    id: '2',
    title: 'Submit Expense Report API',
    date: 'July 16, 2025 - 11:15 AM',
    synced: false,
    local: true,
    reportTitle: 'Client Dinner NYC',
    amount: 'USD 300.00',
    status: 'pending',
    apiEndpoint: '/EBS/23B/createExpenseReport',
  },
  {
    id: '3',
    title: 'Update Expense Line Item',
    date: 'July 16, 2025 - 09:30 AM',
    synced: true,
    local: false,
    reportTitle: 'Office Supplies Q3',
    amount: 'USD 125.50',
    status: 'synced',
    apiEndpoint: '/EBS/23B/updateExpenseLineItem',
  },
  {
    id: '4',
    title: 'Delete Expense Report API',
    date: 'July 15, 2025 - 04:20 PM',
    synced: false,
    local: true,
    reportTitle: 'Cancelled Trip',
    amount: 'USD 0.00',
    status: 'failed',
    apiEndpoint: '/EBS/23B/deleteExpenseReport',
    errorMessage: 'Network timeout - will retry',
  },
  {
    id: '5',
    title: 'Create Expense Report API',
    date: 'July 15, 2025 - 02:15 PM',
    synced: true,
    local: true,
    reportTitle: 'Conference Registration',
    amount: 'USD 899.00',
    status: 'synced',
    apiEndpoint: '/EBS/23B/createExpenseReport',
  },
  {
    id: '6',
    title: 'Submit Expense Report API',
    date: 'July 15, 2025 - 01:45 PM',
    synced: false,
    local: true,
    reportTitle: 'Team Building Event',
    amount: 'USD 675.25',
    status: 'pending',
    apiEndpoint: '/EBS/23B/createExpenseReport',
  },
  {
    id: '7',
    title: 'Upload Receipt API',
    date: 'July 14, 2025 - 03:30 PM',
    synced: true,
    local: false,
    reportTitle: 'Hotel Booking',
    amount: 'USD 245.00',
    status: 'synced',
    apiEndpoint: '/EBS/23B/uploadReceipt',
  },
  {
    id: '8',
    title: 'Create Expense Report API',
    date: 'July 14, 2025 - 11:20 AM',
    synced: false,
    local: true,
    reportTitle: 'Marketing Materials',
    amount: 'USD 189.99',
    status: 'failed',
    apiEndpoint: '/EBS/23B/createExpenseReport',
    errorMessage: 'Authentication failed - please re-login',
  },
];