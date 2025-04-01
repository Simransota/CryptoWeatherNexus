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

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async (_, { rejectWithValue }) => {
  try {
    const cities = ["New York", "London", "Tokyo"]
    const weatherData = await fetchWeatherForCities(cities)

    // Remove null values from failed requests
    const validWeatherData = weatherData.filter((data): data is WeatherData => data !== null)

    if (validWeatherData.length === 0) {
      return rejectWithValue("No weather data available. Please check API configuration.")
    }

    return validWeatherData
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
  }
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
        state.error = action.payload as string || "Failed to fetch weather data"
      })
  },
})

export const { toggleFavoriteCity } = weatherSlice.actions
export default weatherSlice.reducer