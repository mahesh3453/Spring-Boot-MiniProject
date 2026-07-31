export interface PagedResponse<T> {
  content: T[];
  pageNo?: number;
  pageSize?: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
  number?: number;
  size?: number;
  first?: boolean;
}
