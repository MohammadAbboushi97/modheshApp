import {API_BASE_URL} from './config';
import {AppConfig, Offer, Store} from './types';

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${path}`);
  }
  return response.json() as Promise<T>;
};

const query = (params: Record<string, string | number | undefined>) => {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

export const getOffers = (
  filter: {storeId?: number; storeType?: string} = {},
) => request<Offer[]>(`/api/v1/offers/getAll${query(filter)}`);

export const getStores = (storeType?: string) =>
  request<Store[]>(`/api/v1/stores/getAll${query({storeType})}`);

export const getStore = (id: number) => request<Store>(`/api/v1/stores/${id}`);

export const getAppConfig = () => request<AppConfig>('/api/v1/app-config');

// Image URLs come from the backend: absolute when served from S3/CDN, or a
// path on the API server during local development.
export const resolveUrl = (url?: string) => {
  if (!url) {
    return undefined;
  }
  return /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`;
};
