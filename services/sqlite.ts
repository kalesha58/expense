import { SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

/**
 * Initialize the SQLite database.
 */
export async function initDatabase(): Promise<void> {
  if (!db) {
    db = await openDatabaseAsync('expense.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        purpose TEXT,
        expenseType TEXT,
        businessUnit TEXT,
        date TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS line_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        expenseType TEXT,
        merchant TEXT,
        amount REAL NOT NULL,
        currency TEXT,
        projectCode TEXT,
        comments TEXT,
        receipts TEXT,
        FOREIGN KEY(expense_id) REFERENCES expenses(id)
      );
    `);

    console.log('SQLite Database initialized');
  }
}

/**
 * Insert a new expense and its line items into the database.
 */
export async function insertExpense(
  expense: {
    title: string;
    purpose: string;
    expenseType: string;
    businessUnit: string;
    date: string;
  },
  lineItems: Array<{
    date: string;
    expenseType: string;
    merchant: string;
    amount: number;
    currency: string;
    projectCode: string;
    comments?: string;
    receipts?: { uri: string; name?: string; mimeType?: string }[];
  }>
): Promise<number> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.runAsync(
    'INSERT INTO expenses (title, purpose, expenseType, businessUnit, date) VALUES (?, ?, ?, ?, ?)',
    [expense.title, expense.purpose, expense.expenseType, expense.businessUnit, expense.date]
  );
  const expenseId = result.lastInsertRowId;

  for (const item of lineItems) {
    await db.runAsync(
      'INSERT INTO line_items (expense_id, date, expenseType, merchant, amount, currency, projectCode, comments, receipts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        expenseId,
        item.date,
        item.expenseType,
        item.merchant,
        item.amount,
        item.currency,
        item.projectCode,
        item.comments || '',
        JSON.stringify(item.receipts || []),
      ]
    );
  }

  return expenseId;
}

/**
 * Fetch all expenses with their line items.
 */
export async function fetchExpensesWithLineItems(): Promise<
  Array<{
    id: number;
    title: string;
    purpose: string;
    expenseType: string;
    businessUnit: string;
    date: string;
    lineItems: Array<{
      id: number;
      expense_id: number;
      date: string;
      expenseType: string;
      merchant: string;
      amount: number;
      currency: string;
      projectCode: string;
      comments?: string;
      receipts?: { uri: string; name?: string; mimeType?: string }[];
    }>;
  }>
> {
  if (!db) throw new Error('Database not initialized');

  const expensesResult = await db.getAllAsync<any>('SELECT * FROM expenses ORDER BY id DESC');
  const expenses = expensesResult || [];

  for (const expense of expenses) {
    const lineItemsResult = await db.getAllAsync<any>(
      'SELECT * FROM line_items WHERE expense_id = ? ORDER BY id ASC',
      [expense.id]
    );
    expense.lineItems = (lineItemsResult || []).map(item => ({
      ...item,
      receipts: item.receipts ? JSON.parse(item.receipts) : [],
    }));
  }

  return expenses;
}

/**
 * Delete an expense and its related line items by ID.
 */
export async function deleteExpense(id: number): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  await db.runAsync('DELETE FROM line_items WHERE expense_id = ?', [id]);
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}
