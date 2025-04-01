import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchCryptoNews } from "@/lib/api/news"

export type NewsItem = {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

interface NewsState {
  data: NewsItem[]
  loading: boolean
  error: string | null
}

const initialState: NewsState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  return await fetchCryptoNews()
})

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch news data"
      })
  },
})

export default newsSlice.reducer

