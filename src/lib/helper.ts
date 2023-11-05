import { toast } from 'react-hot-toast';

interface ApiRequestOptions {
  body?: BodyInit;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  loadingMessage: string;
  successMessage: string;
  endpoint: string;
  onSuccess: (data: any) => void;
}

export async function makeApiRequest({
  body,
  method,
  headers,
  loadingMessage,
  successMessage,
  endpoint,
  onSuccess,
}: ApiRequestOptions) {
  try {
    await toast.promise(
      fetch(endpoint, {
        method: method,
        headers: headers,
        ...(method !== 'GET' ? { body: body } : {}),
      })
        .then(async (response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          onSuccess(data);
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
      {
        loading: loadingMessage,
        success: successMessage,
        error: (err) => `Processing failed: ${err.message}`,
      }
    );
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}
