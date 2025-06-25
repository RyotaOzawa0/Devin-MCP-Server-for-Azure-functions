export interface Session {
  id: string;
  task: string;
  tags: string[];
  history: any[]; // The Devin API documentation does not specify the shape of history items.
  cwd: string;
  run_id: string | null;
}

export interface UploadFileResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  issues?: any[]; // from zod validation
}
