# Oracle iExpense Mobile App

Oracle iExpense is a modern, enterprise-grade mobile application for managing business expenses, built with React Native and Expo. It streamlines the process of submitting, tracking, and approving expenses, and integrates seamlessly with Oracle E-Business Suite (EBS).

## Overview

- **Purpose:** Simplify and automate expense reporting for employees and managers.
- **Integration:** Real-time sync with Oracle EBS backend via secure REST APIs.
- **Audience:** Enterprise users, finance teams, and IT administrators.

## Key Features

- **Real-time Sync:** Instant synchronization with Oracle EBS backend systems.
- **Policy Compliance:** Automated validation and compliance checking.
- **Enterprise Ready:** Scalable for large organizations.
- **Multi-language Support:** English, Spanish, French (customizable).
- **Dark/Light Mode:** User-selectable themes.
- **Notifications:** Status updates and reminders.
- **Analytics:** Visual statistics and compliance metrics.

## App Structure & Navigation

- **Splash Screen:** Welcome and onboarding message.
- **Authentication:** Secure login (username/password, SSO toggle).
- **Dashboard:** Quick access to create/view expenses, statistics, and recent activity.
- **Expenses:**
  - List, filter, and search expenses
  - Create new expense report
  - Add line items (with receipt upload)
  - Review and submit for approval
  - View details and status
- **Statistics:** Charts and metrics for spending, compliance, and trends.
- **Settings:**
  - Profile (view user info)
  - Account (change password, SSO, language)
  - Preferences (theme, notifications)
  - About & Help

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd expense
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the app:**
   ```bash
   npx expo start
   ```
   - Use Expo Go, Android/iOS emulator, or web browser as prompted.

## Scripts
- `npm start` – Start the Expo development server
- `npm run reset-project` – Reset to a blank starter
- `npm run android` / `npm run ios` / `npm run web` – Platform-specific launch
- `npm run lint` – Lint the codebase

## Tech Stack
- **React Native** (Expo)
- **TypeScript**
- **expo-router** (file-based navigation)
- **@tanstack/react-query** (data fetching)
- **zustand** (state management)
- **react-native-paper** (UI components)
- **i18next** (localization)
- **lucide-react-native** (icons)

## Mock Data & Testing
- The app uses mock data for expenses, statistics, and user info (see `constants/` and `app/(tabs)/expenses/`).
- No backend or Oracle EBS connection is required for local development/testing.

## Contribution Guidelines
- Fork the repo and create a feature branch.
- Follow the existing code style and naming conventions.
- Submit a pull request with a clear description.

## License
This project is for demonstration and internal enterprise use only.

---

For detailed usage and developer instructions, see [`guides.md`](./guides.md).
