import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchCryptoInfo } from "@/lib/api/crypto"

export type CryptoData = {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  image?: string
}

interface CryptoState {
  data: CryptoData[]
  loading: boolean
  error: string | null
  favorites: string[]
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
  favorites: [],
}

export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async () => {
  const cryptos = ["bitcoin", "ethereum", "solana"]
  return await fetchCryptoInfo(cryptos)
})

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload
      if (state.favorites.includes(cryptoId)) {
        state.favorites = state.favorites.filter((id) => id !== cryptoId)
      } else {
        state.favorites.push(cryptoId)
      }
    },
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload
      const crypto = state.data.find((c) => c.id === id)
      if (crypto) {
        crypto.price = price
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch crypto data"
      })
  },
})

export const { toggleFavoriteCrypto, updateCryptoPrice } = cryptoSlice.actions
export default cryptoSlice.reducer

