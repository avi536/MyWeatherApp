"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Sun } from "lucide-react"
import { motion } from "framer-motion"

const getWeatherIcon = (iconCode, size = 6) => {
  // Map OpenWeatherMap icon codes to Lucide icons
  const iconMap = {
    "01": <Sun className={`h-${size} w-${size} text-yellow-500`} />,
    "02": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
    "03": <Cloud className={`h-${size} w-${size} text-gray-400`} />,
    "04": <Cloud className={`h-${size} w-${size} text-gray-500`} />,
    "09": <CloudRain className={`h-${size} w-${size} text-blue-400`} />,
    "10": <CloudRain className={`h-${size} w-${size} text-blue-400`} />,
    "11": <CloudLightning className={`h-${size} w-${size} text-yellow-400`} />,
    "13": <CloudSnow className={`h-${size} w-${size} text-blue-200`} />,
    "50": <CloudFog className={`h-${size} w-${size} text-gray-300`} />,
  }

  // Extract the first 2 characters from the icon code
  const iconPrefix = iconCode.substring(0, 2)
  return iconMap[iconPrefix] || <Cloud className={`h-${size} w-${size} text-gray-400`} />
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

export default function ForecastSection({ data }) {
  if (!data || !data.list) return null

  // Group forecast data by day
  const groupedByDay = {}

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString()
    if (!groupedByDay[date]) {
      groupedByDay[date] = []
    }
    groupedByDay[date].push(item)
  })

  // Get the next 5 days (excluding today if we have enough data)
  const days = Object.keys(groupedByDay).slice(0, 5)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {days.map((day, index) => {
            const dayData = groupedByDay[day]
            // Get the middle of the day forecast (around noon)
            const middayForecast = dayData[Math.floor(dayData.length / 2)]

            // Calculate min and max temperatures for the day
            const minTemp = Math.min(...dayData.map((item) => item.main.temp_min))
            const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max))

            return (
              <motion.div
                key={index}
                className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col items-center transition-colors duration-300"
                variants={item}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="font-medium">{formatDate(middayForecast.dt)}</div>
                <motion.div
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {getWeatherIcon(middayForecast.weather[0].icon)}
                </motion.div>
                <div className="mt-2 text-lg font-semibold">{Math.round(middayForecast.main.temp)}°C</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {Math.round(maxTemp)}° / {Math.round(minTemp)}°
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {middayForecast.weather[0].description}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}
