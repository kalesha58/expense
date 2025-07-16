export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface ApiState {
  status: ApiStatus;
  error?: string;
  data?: any;
}

export interface ApiSequenceState {
  currencies: ApiState;
  departments: ApiState;
  notifications: ApiState;
  organizations: ApiState;
  expenseItems: ApiState;
  currentStep: number;
  isComplete: boolean;
}

export interface ApiInfo {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}