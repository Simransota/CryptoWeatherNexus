import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PreferencesState {
  favoriteCities: string[]
  favoriteCryptos: string[]
}

const initialState: PreferencesState = {
  favoriteCities: [],
  favoriteCryptos: [],
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const city = action.payload
      if (state.favoriteCities.includes(city)) {
        state.favoriteCities = state.favoriteCities.filter((c) => c !== city)
      } else {
        state.favoriteCities.push(city)
      }
    },
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload
      if (state.favoriteCryptos.includes(cryptoId)) {
        state.favoriteCryptos = state.favoriteCryptos.filter((id) => id !== cryptoId)
      } else {
        state.favoriteCryptos.push(cryptoId)
      }
    },
  },
})

export const { toggleFavoriteCity, toggleFavoriteCrypto } = preferencesSlice.actions
export default preferencesSlice.reducer

