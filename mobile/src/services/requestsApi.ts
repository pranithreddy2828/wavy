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
  total: number;
  city: string;
  timestamp: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  total: number;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<CategoriesResponse>('/categories');
  return response.data.categories;
};

export const fetchFeed = async (params?: {
  category?: string;
  urgency?: string;
  max_distance?: number;
}): Promise<FeedResponse> => {
  const response = await apiClient.get<FeedResponse>('/requests/feed', { params });
  return response.data;
};

