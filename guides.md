# Oracle iExpense Mobile App – Guides

## Table of Contents
1. [App Overview](#app-overview)
2. [Navigation & Main Screens](#navigation--main-screens)
3. [Authentication Flow](#authentication-flow)
4. [Expense Management](#expense-management)
5. [Statistics & Analytics](#statistics--analytics)
6. [Settings & Customization](#settings--customization)
7. [Mock Data & Testing](#mock-data--testing)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## App Overview
Oracle iExpense is a mobile app for enterprise expense management, designed for seamless integration with Oracle E-Business Suite (EBS). It enables employees to submit, track, and manage business expenses, while ensuring compliance with corporate policies.

---

## Navigation & Main Screens

- **Splash Screen:** Motivational message and branding.
- **Authentication:** Login with username/password. SSO toggle available in account settings.
- **Dashboard:**
  - Welcome message
  - Quick links: Create Expense, View Expenses, Transaction History
  - Recent expenses summary
- **Expenses:**
  - List, filter, and search all expense reports
  - Tap to view details
  - Floating action button to create a new report
- **Statistics:**
  - Charts and metrics for spending, compliance, and trends
  - Tabs for weekly, monthly, yearly views
- **Settings:**
  - Profile: View user info
  - Account: Change password, enable SSO, select language
  - Preferences: Theme (dark/light), notifications
  - About: App info, version, FAQ
  - Help & Support

---

## Authentication Flow

- **Login Screen:**
  - Enter username (email) and password
  - Toggle dark/light mode
  - Error messages for invalid credentials
  - On success, navigates to Activity/Initialization screen
- **Account Settings:**
  - Change password (future feature)
  - Enable/disable SSO (Single Sign-On)
  - Select app language
- **Security:**
  - All authentication state managed via context and hooks
  - Secure session handling

---

## Expense Management

### 1. Create Expense Report
- Tap "+" or "Create Expense" from dashboard or expenses list
- Fill in:
  - Report Title
  - Purpose
  - Expense Type (Travel, Meals, etc.)
  - Business Unit
  - Date
- Save as draft or continue to add line items

### 2. Add Line Items
- For each expense item:
  - Date
  - Expense Type
  - Merchant/Vendor
  - Amount & Currency
  - Project Code
  - Comments (optional)
  - Upload receipt (image or PDF)
- Add multiple line items as needed

### 3. Review & Submit
- Review all report and line item details
- Edit or add more items if needed
- Save as draft or submit for approval
- Policy reminders and best practices shown

### 4. Confirmation
- See report ID, status, and submission date
- Options to view report or return to dashboard
- Notification sent for status updates

### 5. Expense List & Details
- Filter/search by status, title, or category
- Tap any report to view full details, line items, receipts, and approval status

---

## Statistics & Analytics
- Access from the Statistics tab
- View charts for total/average spending, compliance rate, and policy violations
- Switch between weekly, monthly, and yearly data
- Compliance overview and key metrics
- All data is mock/demo for local development

---

## Settings & Customization
- **Profile:** View user info (name, employee ID, email, etc.)
- **Account:**
  - Change password (future feature)
  - Enable/disable SSO
  - Select language (English, Spanish, French)
- **Preferences:**
  - Toggle dark/light mode
  - Enable/disable notifications (future feature)
- **About:**
  - App version, description, and FAQ
- **Help & Support:**
  - Contact info or support links (future feature)

---

## Mock Data & Testing
- All expense, statistics, and user data is mock/demo (see `constants/` and `app/(tabs)/expenses/`)
- No backend or Oracle EBS connection is required for local development
- To reset the project, use:
  ```bash
  npm run reset-project
  ```
- For localization, edit `app/i18n.ts` and related translation files

---

## FAQ & Troubleshooting

### What is Oracle iExpense used for?
- Submitting, managing, and tracking employee expenses within Oracle E-Business Suite.

### How do I know if my expense is approved?
- Check the Dashboard or Notifications. Approved reports show a green "Approved" status.

### Why was my expense rejected?
- Common reasons: policy violations, missing receipts, incorrect types, or exceeding limits. See the rejection reason in expense details.

### Can I submit expenses offline?
- Yes, you can save drafts offline. They sync when you reconnect.

### What file formats are supported for receipts?
- JPG, PNG, and PDF files.

### How does the app connect to Oracle?
- Via secure REST APIs (mocked in local/dev mode).

### How do I change my language or theme?
- Go to Settings > Account for language, or Settings > Preferences for theme.

### Who manages my profile info?
- Profile info is managed by your system administrator. Contact HR for changes.

---

For further help, see the code comments or contact your IT administrator. 