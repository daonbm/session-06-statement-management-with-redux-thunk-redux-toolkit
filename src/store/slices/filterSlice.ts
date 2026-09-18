import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FilterState } from '../../types/task';

const initialState: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: <K extends keyof FilterState>(
      state: FilterState,
      action: PayloadAction<{ key: K; value: FilterState[K] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetFilters: () => initialState
  }
});

export const { setFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;