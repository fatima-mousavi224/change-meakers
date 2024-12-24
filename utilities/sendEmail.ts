import { FormData } from '../lib/types';

interface ApiResponse {
  message: string;

  // Add other properties if applicable
}

interface ApiError {
  error: string;
}

export function sendEmail(data: FormData): Promise<ApiResponse> {
  const apiEndpoint = '/api/email';

  return fetch(apiEndpoint, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return res.json() as Promise<ApiResponse | string>;
    })
    .then((response) => {
      if (typeof response === 'string') {
        // Convert string response to ApiResponse object
        return { message: response } as ApiResponse;
      }

      return response as ApiResponse; // Ensure to return ApiResponse type
    })
    .catch((err: ApiError | Error) => {
      // Check if it's an ApiError (error from the API)
      if ('error' in err) {
        throw err; // Throw the error to keep the return type consistent
      } else {
        // It's a general error
        throw new Error(err.message); // Throw a new Error to keep the return type consistent
      }
    });
}
