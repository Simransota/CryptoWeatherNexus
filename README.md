# CryptoWeather Nexus

**CryptoWeather Nexus** is a modern web application that combines real-time cryptocurrency data, weather information, and live notifications using WebSocket connections. Users can explore live data for cryptocurrencies and weather conditions for different cities. Additionally, the app allows users to set real-time price and weather alerts.

## Table of Contents
- [Overview](#overview)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Design Decisions](#design-decisions)
- [API Integrations](#api-integrations)
- [Real-Time Notifications](#real-time-notifications)
- [Challenges & Solutions](#challenges--solutions)
- [API Documentation](#api-documentation)
- [License](#license)

## Overview
**CryptoWeather Nexus** is built with **Next.js (v13+)** and **React**, using **Redux** for global state management and **Tailwind CSS** for responsive design. The app features real-time updates for cryptocurrency prices and weather data, providing users with a unified platform for financial and environmental monitoring.

### Features:
- Real-time cryptocurrency data (prices, changes, trends).
- Weather data (current temperature, humidity, conditions).
- City and cryptocurrency pages for detailed exploration.
- Real-time WebSocket notifications for price changes and weather conditions.

## Setup & Installation

To run this project locally, follow these steps:

### 1. Clone the Repository:
```bash
git clone https://github.com/yourusername/crypto-weather-nexus.git
cd crypto-weather-nexus
```

### 2. Install Dependencies:
```bash
npm install
```

### 3. Environment Variables:
Create a `.env` file in the root of your project and add the following:

```
NEXT_PUBLIC_CRYPTO_API_KEY=your_crypto_api_key
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_WEBSOCKET_URL=your_websocket_url
```

- `NEXT_PUBLIC_CRYPTO_API_KEY`: Your API key for cryptocurrency data.
- `NEXT_PUBLIC_WEATHER_API_KEY`: Your API key for weather data.
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket URL for real-time notifications.

### 4. Run the Application:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to view the app.

## Usage

- **Explore Cryptocurrencies**: Navigate to the "Cryptocurrencies" section to view live data for various coins like Bitcoin, Ethereum, etc.
- **Weather Exploration**: Visit the "Weather" section to check the weather for different cities in real time.
- **Set Alerts**: You can set price and weather alerts to be notified via WebSocket when thresholds are met.

## Design Decisions

- **Next.js & React**: Chosen for their flexibility and ability to easily handle SSR (server-side rendering) and static site generation for fast load times.
- **Redux**: Used for global state management, ensuring efficient data handling across components.
- **Tailwind CSS**: A utility-first CSS framework was selected for rapid styling and responsive design.
- **WebSocket**: Used for real-time notifications, keeping users updated on the latest cryptocurrency price changes and weather updates.

## API Integrations

### 1. **Crypto API (CoinGecko)**:
The app uses the CoinGecko API to fetch real-time cryptocurrency data, including prices, trends, and market data.

- **API Endpoint**: `/coins/markets`
- **Required Parameters**: 
    - `vs_currency`: The currency to compare (e.g., USD).
    - `ids`: A comma-separated list of cryptocurrency IDs (e.g., `bitcoin,ethereum`).

### 2. **Weather API (OpenWeatherMap)**:
The app fetches real-time weather data for various cities using the OpenWeatherMap API.

- **API Endpoint**: `/data/2.5/weather`
- **Required Parameters**: 
    - `q`: The city name (e.g., `London`).
    - `appid`: Your OpenWeatherMap API key.

## Real-Time Notifications

The app uses WebSocket connections for real-time notifications. This allows users to be alerted immediately when:
- A cryptocurrency’s price reaches a predefined threshold.
- Weather conditions in a specific city change significantly.

### WebSocket Implementation:
- A WebSocket server is set up to broadcast notifications to all connected clients whenever there is a price or weather update.

## Challenges & Solutions

### Challenge 1: **Handling Real-Time Data**
- **Solution**: Implemented WebSocket to manage real-time data for cryptocurrency and weather updates, ensuring users receive instant notifications when changes occur.

### Challenge 2: **Rate Limiting on APIs**
- **Solution**: To handle rate limiting, caching was implemented for API requests to reduce unnecessary load on the servers and improve app performance.

### Challenge 3: **Responsive Design**
- **Solution**: Used Tailwind CSS for responsive layouts to ensure the app functions well on both desktop and mobile devices.

## API Documentation

- **CoinGecko API**: [CoinGecko API Docs](https://www.coingecko.com/en/api)
- **OpenWeatherMap API**: [OpenWeatherMap API Docs](https://openweathermap.org/api)
- **WebSocket Protocol**: The WebSocket server follows a simple push notification protocol, notifying clients of relevant data updates.



