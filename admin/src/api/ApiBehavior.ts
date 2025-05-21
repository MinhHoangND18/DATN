import { fetcher } from './Fetcher';

interface Query {
  start_date?: string;
  end_date?: string;
  user_id?: number;
}

interface BehaviorData {
  user_id: number;
  views: number;
  cart_adds: number;
  purchases: number;
  last_activity: string;
  username: string;
}

function getUserBehavior(params?: Query): Promise<DataListResponse<BehaviorData>> {
  return fetcher({ url: '/behavior', method: 'get', params });
}

export default {
  getUserBehavior,
};
