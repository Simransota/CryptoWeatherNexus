import { store } from "@/redux/store";
import { updateCryptoPrice } from "@/redux/features/cryptoSlice";
import { addNotification } from "@/redux/features/notificationsSlice";

// Configuration flag to choose between real and mock WebSocket
const USE_REAL_WEBSOCKET = process.env.NODE_ENV === 'production';

export function setupWebSocket() {
  if (USE_REAL_WEBSOCKET) {
    return setupRealWebSocket();
  } else {
    return setupMockWebSocket();
  }
}

function setupRealWebSocket() {
  // Connection status tracking
  let isConnecting = false;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 5000;
  
  function connect() {
    if (isConnecting) return null;
    isConnecting = true;
    
    try {
      // Connect to CoinCap WebSocket for real-time price updates
      const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum");
      
      ws.onopen = () => {
        console.log("WebSocket connection established");
        isConnecting = false;
        reconnectAttempts = 0;
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Process bitcoin data
          if (data.bitcoin) {
            processPrice("bitcoin", Number.parseFloat(data.bitcoin));
          }
          
          // Process ethereum data
          if (data.ethereum) {
            processPrice("ethereum", Number.parseFloat(data.ethereum));
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        isConnecting = false;
        
        // Fall back to polling if WebSocket fails
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log("WebSocket connection failed repeatedly. Falling back to polling.");
          setupPolling();
          return;
        }
      };
      
      ws.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event?.code} ${event?.reason || ""}`);
        isConnecting = false;
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = RECONNECT_DELAY * Math.pow(1.5, reconnectAttempts);
          reconnectAttempts++;
          
          console.log(`Attempting to reconnect WebSocket in ${delay}ms... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
          setTimeout(connect, delay);
        } else {
          console.log("Maximum reconnection attempts reached. Falling back to polling.");
          setupPolling();
        }
      };
      
      return {
        close: () => {
          try {
            ws.close();
          } catch (e) {
            console.error("Error closing WebSocket:", e);
          }
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      isConnecting = false;
      setupPolling();
      return null;
    }
  }
  
  // Start the WebSocket connection
  const connection = connect();
  
  // Simulate weather alerts for demo purposes
  simulateWeatherAlerts();
  
  return connection || { close: () => {} };
}

function setupMockWebSocket() {
  console.log("Setting up price updates simulation (mock WebSocket)");
  
  // Mock WebSocket object
  const mockWs = {
    close: () => {
      clearInterval(priceUpdateInterval);
      clearInterval(weatherInterval);
      console.log("Mock WebSocket closed");
    }
  };
  
  // Initial crypto prices with proper type definition
  const cryptos: { [key: string]: number } = {
    bitcoin: 45000 + (Math.random() * 5000),
    ethereum: 3000 + (Math.random() * 500)
  };
  
  // Update prices every 5 seconds with small variations
  const priceUpdateInterval = setInterval(() => {
    for (const [cryptoId, basePrice] of Object.entries(cryptos)) {
      // Apply a small random change (-2% to +2%)
      const changePercent = (Math.random() * 4) - 2; // -2 to +2
      const newPrice = basePrice * (1 + (changePercent / 100));
      cryptos[cryptoId] = newPrice;
      
      // Dispatch the price update to the store
      store.dispatch(updateCryptoPrice({ 
        id: cryptoId, 
        price: newPrice 
      }));
      
      // Occasionally trigger a larger price movement for notifications
      if (Math.random() < 0.1) { // 10% chance
        const currentState = store.getState();
        const cryptoData = currentState.crypto.data.find((c: { id: string }) => c.id === cryptoId);
        
        // If we have data for this crypto, create a notification
        if (cryptoData) {
          const significant = Math.abs(newPrice - cryptoData.price) / cryptoData.price > 0.01;
          if (significant) {
            store.dispatch(
              addNotification({
                type: "price_alert",
                message: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} price ${newPrice > cryptoData.price ? "surged" : "dropped"} to $${newPrice.toLocaleString()}!`,
              })
            );
          }
        }
      }
    }
  }, 5000);
  
  // Simulate weather alerts
  const weatherInterval = simulateWeatherAlerts();
  
  return mockWs;
}

// Helper function to process price updates for both real and mock implementations
function processPrice(cryptoId: string, price: number) {
  store.dispatch(updateCryptoPrice({ id: cryptoId, price }));
  
  // Check for significant price changes (more than 1% in this demo)
  const currentState = store.getState();
  const cryptoData = currentState.crypto.data.find((c: { id: string }) => c.id === cryptoId);
  
  if (cryptoData && Math.abs(price - cryptoData.price) / cryptoData.price > 0.01) {
    store.dispatch(
      addNotification({
        type: "price_alert",
        message: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} price ${price > cryptoData.price ? "surged" : "dropped"} to $${price.toLocaleString()}!`,
      })
    );
  }
}

// Fallback polling implementation when WebSockets fail
function setupPolling() {
  console.log("Setting up polling for price updates instead of WebSockets");
  
  // Poll every 10 seconds
  const POLL_INTERVAL = 10000;
  
  const pollPrices = async () => {
    try {
      const response = await fetch("https://api.coincap.io/v2/assets?ids=bitcoin,ethereum");
      const data = await response.json();
      
      if (data && data.data) {
        data.data.forEach((crypto: any) => {
          processPrice(crypto.id, Number.parseFloat(crypto.priceUsd));
        });
      }
    } catch (error) {
      console.error("Error polling prices:", error);
    }
  };
  
  // Initial poll
  pollPrices();
  
  // Set up interval
  const intervalId = setInterval(pollPrices, POLL_INTERVAL);
  
  return intervalId;
}

function simulateWeatherAlerts() {
  const weatherEvents = [
    "Heavy rain expected in London tomorrow",
    "Heat wave warning for Tokyo this weekend",
    "Snowstorm alert for New York area",
    "Strong winds expected in London tonight",
    "Air quality warning for Tokyo metropolitan area",
  ];

  // Send a random weather alert every 30-60 seconds
  const intervalId = setInterval(
    () => {
      const randomEvent = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
      store.dispatch(
        addNotification({
          type: "weather_alert",
          message: randomEvent,
        })
      );
    },
    30000 + Math.random() * 30000
  );
  
  return intervalId;
}