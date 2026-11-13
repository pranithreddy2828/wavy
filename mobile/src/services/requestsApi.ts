import { apiClient } from './api';

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
}

export interface RequesterInfo {
  display_name: string;
  rating_avg: number;
  reviews_count: number;
  is_verified: boolean;
}

export interface CommunityRequest {
  id: string;
  title: string;
  description: string;
  category_slug: string;
  category_name: string;
  category_icon: string;
  urgency: 'low' | 'medium' | 'urgent';
  budget: number | null;
  is_negotiable: boolean;
  fulfillment_type: 'pickup' | 'delivery' | 'on_premise' | 'remote';
  area_name: string;
  distance_km: number;
  requester: RequesterInfo;
  offers_count: number;
  created_at: string;
}

export interface FeedResponse {
  success: boolean;
  requests: CommunityRequest[];
  total?: number;
  city?: string;
  timestamp?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  total: number;
}

export interface CreateRequestPayload {
  title: string;
  description?: string;
  category_id?: number;
  urgency?: 'low' | 'medium' | 'urgent';
  budget?: number;
  area_name?: string;
  city?: string;
  visibility_radius_km?: number;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<CategoriesResponse>('/categories');
    return response.data.categories;
  } catch {
    return [
      { id: 1, slug: 'printing', name: 'Printing & Xerox', description: '', icon_name: 'printer', display_order: 1 },
      { id: 2, slug: 'tutoring', name: 'Tutoring', description: '', icon_name: 'book', display_order: 2 },
      { id: 3, slug: 'laptop-repair', name: 'Laptop Repair', description: '', icon_name: 'laptop', display_order: 3 },
      { id: 4, slug: 'transportation', name: 'Rides & Carpool', description: '', icon_name: 'car', display_order: 4 },
      { id: 5, slug: 'shopping-assistance', name: 'Medicine / Groceries', description: '', icon_name: 'shopping-bag', display_order: 5 },
    ];
  }
};

export const fetchFeed = async (params?: {
  category?: string;
  urgency?: string;
  max_distance?: number;
  q?: string;
}): Promise<FeedResponse> => {
  const response = await apiClient.get<FeedResponse>('/requests/feed', { params });
  return response.data;
};

export const createCommunityRequest = async (payload: CreateRequestPayload): Promise<CommunityRequest> => {
  const response = await apiClient.post<{ success: boolean; request: CommunityRequest }>('/requests', payload);
  return response.data.request;
};

export const submitOffer = async (
  requestId: string,
  proposedPrice: number,
  eta: string,
  note?: string
) => {
  const response = await apiClient.post(`/requests/${requestId}/offers`, {
    proposed_price: proposedPrice,
    estimated_completion: eta,
    note,
  });
  return response.data;
};
