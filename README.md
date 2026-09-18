# Session 06: State Management với Redux Toolkit, Redux Thunk & RTK Query

Dự án này là minh chứng chuyên sâu cho việc refactor từ React Context API sang kiến trúc Redux hiện đại, bao gồm **Redux Toolkit (RTK)**, **Redux Thunk**, và **Redux Toolkit Query (RTK Query)**.

## Các Tính Năng & Kiến Trúc Nổi Bật

1. **Redux Toolkit (RTK Core)**:
   - Quản lý Global State (UI, Filters) thông qua `createSlice` và `configureStore`.
   - Sử dụng `createSelector` để xây dựng memoized selectors tối ưu hóa hiệu năng lọc và sắp xếp.
   - Typed hooks (`useAppDispatch`, `useAppSelector`).

2. **Redux Thunk (Async Side Effects)**:
   - Xử lý bất đồng bộ qua `createAsyncThunk` với đầy đủ các vòng đời (`pending`, `fulfilled`, `rejected`).
   - Xử lý CRUD API thông qua `extraReducers` builder pattern.

3. **Redux Toolkit Query (RTK Query)**:
   - Tầng Data Fetching & Caching mạnh mẽ thông qua `createApi` và `fetchBaseQuery`.
   - Cơ chế tự động quản lý Cache Tag Invalidation (`providesTags`, `invalidatesTags`) giúp tự động làm mới dữ liệu khi có mutation.

4. **Engine Switcher**:
   - Cho phép chuyển đổi linh hoạt giữa hai chế độ **Redux Thunk Mode** và **RTK Query Mode** ngay trên giao diện Navbar để so sánh luồng dữ liệu và hiệu năng.

## Hướng Dẫn Chạy Dự Án

```bash
# 1. Cài đặt thư viện
npm install

# 2. Khởi động môi trường phát triển
npm run dev

# 3. Build production và kiểm tra TypeScript types
npm run build