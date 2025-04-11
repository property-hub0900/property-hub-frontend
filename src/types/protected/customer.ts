export interface ISavedSearches {
  isError: false;
  page: 0;
  pageSize: 20;
  results: ISavedSearch[];
  total: 0;
}

export interface ISavedSearch {
  searchId: number;
  customerId: number;
  searchTitle: string;
  searchQuery: string;
  createdAt: string;
}
