import { useCallback, useEffect, useReducer } from "react";
import { router } from "expo-router";

import { API_SEQUENCE } from "@/constants/api";
import { fetchApi } from "@/services/api";
import { ApiSequenceState, ApiState } from "@/@types/api";


// Initial state for the API sequence
const initialState: ApiSequenceState = {
  currencies: { status: "idle" },
  departments: { status: "idle" },
  notifications: { status: "idle" },
  organizations: { status: "idle" },
  expenseItems: { status: "idle" },
  currentStep: 0,
  isComplete: false,
};

// Reducer to manage API sequence state
function apiSequenceReducer(state: ApiSequenceState, action: any): ApiSequenceState {
  switch (action.type) {
    case "API_START":
      return {
        ...state,
        [action.apiId]: { status: "loading" },
      };
    case "API_SUCCESS":
      return {
        ...state,
        [action.apiId]: { status: "success", data: action.data },
        currentStep: state.currentStep + 1,
      };
    case "API_ERROR":
      return {
        ...state,
        [action.apiId]: { status: "error", error: action.error },
        currentStep: state.currentStep + 1,
      };
    case "RETRY_API":
      return {
        ...state,
        [action.apiId]: { status: "idle" },
        currentStep: API_SEQUENCE.findIndex(api => api.id === action.apiId),
      };
    case "COMPLETE":
      return {
        ...state,
        isComplete: true,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useApiSequence() {
  const [state, dispatch] = useReducer(apiSequenceReducer, initialState);

  const executeApiStep = useCallback(async (stepIndex: number) => {
    if (stepIndex >= API_SEQUENCE.length) {
      dispatch({ type: "COMPLETE" });
      return;
    }

    const apiInfo = API_SEQUENCE[stepIndex];
    dispatch({ type: "API_START", apiId: apiInfo.id });

    try {
      // Using real API calls
      const data = await fetchApi(apiInfo);
      dispatch({ type: "API_SUCCESS", apiId: apiInfo.id, data });
    } catch (error) {
      dispatch({ 
        type: "API_ERROR", 
        apiId: apiInfo.id, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }, []);

  const retryApi = useCallback((apiId: string) => {
    dispatch({ type: "RETRY_API", apiId });
  }, []);

  const resetSequence = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Execute API steps sequentially
  useEffect(() => {
    // Only navigate if all APIs are successful
    if (state.isComplete) {
      const allSuccessful = API_SEQUENCE.every(api => 
        (state[api.id as keyof typeof state] as ApiState)?.status === "success"
      );
      
      if (allSuccessful) {
        // Navigate to dashboard after a short delay
        const timer = setTimeout(() => {
          router.replace("/");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }

    executeApiStep(state.currentStep);
  }, [state.currentStep, state.isComplete, executeApiStep]);

  return {
    state,
    retryApi,
    resetSequence,
    apiSequence: API_SEQUENCE,
  };
}