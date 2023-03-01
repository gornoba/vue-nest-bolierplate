export interface SocektError {
  error: {
    error: string;
    message: string;
    statusCode: number;
  };
  result: false;
}

export interface AxiosErrorType {
  error: string;
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}
