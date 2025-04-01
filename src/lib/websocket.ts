import { store } from "@/redux/store"
import { updateCryptoPrice } from "@/redux/features/cryptoSlice"
import { addNotification } from "@/redux/features/notificationsSlice"

export function setupWebSocket() {
  // Connect to CoinCap WebSocket for real-time price updates
  const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum")

  ws.onopen = () => {
    console.log("WebSocket connection established")
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      // Update prices in the store
      if (data.bitcoin) {
        const price = Number.parseFloat(data.bitcoin)
        store.dispatch(updateCryptoPrice({ id: "bitcoin", price }))

        // Check for significant price changes (more than 1% in this demo)
        const currentState = store.getState()
        const btcData = currentState.crypto.data.find((c: { id: string }) => c.id === "bitcoin")

        if (btcData && Math.abs(price - btcData.price) / btcData.price > 0.01) {
          store.dispatch(
            addNotification({
              type: "price_alert",
              message: `Bitcoin price ${price > btcData.price ? "surged" : "dropped"} to $${price.toLocaleString()}!`,
            }),
          )
        }
      }

      if (data.ethereum) {
        const price = Number.parseFloat(data.ethereum)
        store.dispatch(updateCryptoPrice({ id: "ethereum", price }))

        // Check for significant price changes
        const currentState = store.getState()
        const ethData = currentState.crypto.data.find((c: { id: string }) => c.id === "ethereum")

        if (ethData && Math.abs(price - ethData.price) / ethData.price > 0.01) {
          store.dispatch(
            addNotification({
              type: "price_alert",
              message: `Ethereum price ${price > ethData.price ? "surged" : "dropped"} to $${price.toLocaleString()}!`,
            }),
          )
        }
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error)
    }
  }

  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  ws.onclose = () => {
    console.log("WebSocket connection closed")
    // Attempt to reconnect after a delay
    setTimeout(() => {
      console.log("Attempting to reconnect WebSocket...")
      setupWebSocket()
    }, 5000)
  }

  // Simulate weather alerts for demo purposes
  simulateWeatherAlerts()

  return ws
}

function simulateWeatherAlerts() {
  const weatherEvents = [
    "Heavy rain expected in London tomorrow",
    "Heat wave warning for Tokyo this weekend",
    "Snowstorm alert for New York area",
    "Strong winds expected in London tonight",
    "Air quality warning for Tokyo metropolitan area",
  ]

  // Send a random weather alert every 30-60 seconds
  setInterval(
    () => {
      const randomEvent = weatherEvents[Math.floor(Math.random() * weatherEvents.length)]
      store.dispatch(
        addNotification({
          type: "weather_alert",
          message: randomEvent,
        }),
      )
    },
    30000 + Math.random() * 30000,
  )
}

