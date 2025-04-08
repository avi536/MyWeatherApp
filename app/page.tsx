"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, RefreshCw, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import WeatherDisplay from "@/components/weather-display"
import ForecastSection from "@/components/forecast-section"
import ErrorMessage from "@/components/error-message"
import ThemeToggle from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

export default function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [recentSearches, setRecentSearches] = useState([])

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
  }, [recentSearches])

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return

    setLoading(true)
    setError("")

    try {
      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(searchCity)}`)
      const weatherResult = await weatherResponse.json()

      if (!weatherResponse.ok) {
        throw new Error(weatherResult.message || "Failed to fetch weather data")
      }

      setWeatherData(weatherResult)

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodeURIComponent(searchCity)}`)
      const forecastResult = await forecastResponse.json()

      if (!forecastResponse.ok) {
        throw new Error(forecastResult.message || "Failed to fetch forecast data")
      }

      setForecastData(forecastResult)

      // Add to recent searches
      updateRecentSearches(searchCity)
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather(city)
  }

  const updateRecentSearches = (searchCity) => {
    setRecentSearches((prev) => {
      // Remove the city if it already exists to avoid duplicates
      const filteredSearches = prev.filter((item) => item.toLowerCase() !== searchCity.toLowerCase())
      // Add the new city at the beginning and limit to 5 items
      return [searchCity, ...filteredSearches].slice(0, 5)
    })
  }

  const handleRecentSearchClick = (searchCity) => {
    setCity(searchCity)
    fetchWeather(searchCity)
  }

  const handleRefresh = () => {
    if (weatherData?.name) {
      fetchWeather(weatherData.name)
    }
  }

  const clearRecentSearch = (e, searchCity) => {
    e.stopPropagation()
    setRecentSearches((prev) => prev.filter((item) => item !== searchCity))
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white"
          >
            Weather Dashboard
          </motion.h1>
          <ThemeToggle />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </form>
        </motion.div>

        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2 self-center">Recent:</span>
            {recentSearches.map((searchCity) => (
              <Badge
                key={searchCity}
                variant="secondary"
                className="cursor-pointer px-3 py-1 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => handleRecentSearchClick(searchCity)}
              >
                {searchCity}
                <X
                  className="h-3 w-3 ml-1 opacity-70 hover:opacity-100"
                  onClick={(e) => clearRecentSearch(e, searchCity)}
                />
              </Badge>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ErrorMessage message={error} />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-20"
          >
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </motion.div>
        )}

        <AnimatePresence>
          {weatherData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <WeatherDisplay data={weatherData} />
              {forecastData && <ForecastSection data={forecastData} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
