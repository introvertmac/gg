export interface AuthResult {
  status: 'success' | 'error';
  data?: {
    auth_token: string;
    refresh_auth_token: string;
    device_token: string;
    message: string;
  };
  error?: string;
}
