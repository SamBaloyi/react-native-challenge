  export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
  }
  
  export interface ApiError {
    status: number;
    message: string;
    details?: string;
  }