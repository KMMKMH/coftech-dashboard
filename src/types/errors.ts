export interface ApiErrorShape {
    code?: string;
    message?: string;
    metadata?: Record<string, unknown>;
    statusCode?: number;
}

export interface AxiosErrorShape {
    response?: {
        data?: {
            error?: ApiErrorShape;
        };
    };
}

export type RtkQueryErrorShape =
  | { status: number; data?: { error?: ApiErrorShape }; error?: string }
  | { status: "TIMEOUT_ERROR" | "FETCH_ERROR" | "PARSING_ERROR" | "CUSTOM_ERROR"; data?: unknown; error?: string };


export interface GraphQLErrorExtensions {
    code?: string;
    metadata?: Record<string, unknown>;
    statusCode?: number;
}

export interface GraphQLErrorShape {
    message: string;
    extensions?: GraphQLErrorExtensions;
}

export interface GraphQLClientError {
    graphQLErrors: GraphQLErrorShape[];
}

export type BackendError = ApiErrorShape | AxiosErrorShape | RtkQueryErrorShape | GraphQLClientError;

export interface NormalizedError {
    errorCode?: string;
    translatedMessage: string;
    metadata?: Record<string, unknown>;
    statusCode?: number;
}

export const VALIDATION_ERROR_TYPES = {
  MIN: 'MIN',
  MAX: 'MAX',
  REQUIRED: 'REQUIRED',
  OTHER: 'OTHER',
} as const;

export type ValidationErrorType = typeof VALIDATION_ERROR_TYPES[keyof typeof VALIDATION_ERROR_TYPES];
