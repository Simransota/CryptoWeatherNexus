import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { fetchWeatherForCities } from "@/lib/api/weather"

export type WeatherData = {
  city: string
  temperature: number
  humidity: number
  conditions: string
  icon: string
}

interface WeatherState {
  data: WeatherData[]
  loading: boolean
  error: string | null
  favorites: string[]
}

const initialState: WeatherState = {
  data: [],
  loading: false,
  error: null,
  favorites: [],
}

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  const cities = ["New York", "London", "Tokyo"]
  return await fetchWeatherForCities(cities)
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const city = action.payload
      if (state.favorites.includes(city)) {
        state.favorites = state.favorites.filter((c) => c !== city)
      } else {
        state.favorites.push(city)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch weather data"
      })
  },
})

export const { toggleFavoriteCity } = weatherSlice.actions
export default weatherSlice.reducer

