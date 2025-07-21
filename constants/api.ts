import { ApiInfo } from "@/@types/api";

export const API_SEQUENCE: ApiInfo[] = [
  {
    id: "currencies",
    name: "Get Currencies",
    description: "Fetching available currencies",
    endpoint: "https://testnode.propelapps.com/EBS/23B/getCurrencies/%22%22",
  },
  {
    id: "departments",
    name: "Get Departments",
    description: "Loading department information",
    endpoint: "https://testnode.propelapps.com/EBS/23B/getAllDepartments/%22%22",
  },
  {
    id: "notifications",
    name: "Get Notifications",
    description: "Retrieving expense notifications",
    endpoint: "https://testnode.propelapps.com/EBS/23B/getExpenseNotificationDetails/1015084/''",
  },
  {
    id: "organizations",
    name: "Get Organizations",
    description: "Loading inventory organizations",
    endpoint: "https://testnode.propelapps.com/EBS/20D/getInventoryOrganizations/7923",
  },
  {
    id: "expenseItems",
    name: "Get Expense Items",
    description: "Fetching expense items",
    endpoint: "https://testnode.propelapps.com/EBS/23B/getExpenseItem/7923/''",
  },
];