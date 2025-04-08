"use client"

import { Cloud, Droplets, Thermometer, Wind, Sun, CloudRain, CloudSnow, CloudFog, CloudLightning } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const getWeatherIcon = (iconCode) => {
  // Map OpenWeatherMap icon codes to Lucide icons
  const iconMap = {
    "01": <Sun className="h-12 w-12 text-yellow-500" />,
    "02": <Cloud className="h-12 w-12 text-gray-400" />,
    "03": <Cloud className="h-12 w-12 text-gray-400" />,
    "04": <Cloud className="h-12 w-12 text-gray-500" />,
    "09": <CloudRain className="h-12 w-12 text-blue-400" />,
    "10": <CloudRain className="h-12 w-12 text-blue-400" />,
    "11": <CloudLightning className="h-12 w-12 text-yellow-400" />,
    "13": <CloudSnow className="h-12 w-12 text-blue-200" />,
    "50": <CloudFog className="h-12 w-12 text-gray-300" />,
  }

  // Extract the first 2 characters from the icon code
  const iconPrefix = iconCode.substring(0, 2)
  return iconMap[iconPrefix] || <Cloud className="h-12 w-12 text-gray-400" />
}

export default function WeatherDisplay({ data }) {
  if (!data) return null

  const { name, main, weather, wind, sys } = data
  const iconCode = weather[0]?.icon || "01d"

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <CardContent className="p-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="flex flex-col items-center md:items-start gap-2" variants={item}>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{name}</h2>
              {sys?.country && (
                <span className="text-sm bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded transition-colors duration-300">
                  {sys.country}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2">
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {getWeatherIcon(iconCode)}
              </motion.div>
              <div>
                <motion.div
                  className="text-4xl font-bold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {Math.round(main?.temp)}°C
                </motion.div>
                <div className="text-slate-500 dark:text-slate-400 capitalize">{weather[0]?.description}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-2 text-sm">
              <span className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                {Math.round(main?.temp_max)}°
              </span>
              <span>/</span>
              <span className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-blue-500" />
                {Math.round(main?.temp_min)}°
              </span>
            </div>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-4" variants={item}>
            <motion.div
              className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex flex-col items-center transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Thermometer className="h-6 w-6 mb-1 text-orange-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Feels Like</span>
              <span className="font-medium">{Math.round(main?.feels_like)}°C</span>
            </motion.div>

            <motion.div
              className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex flex-col items-center transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Droplets className="h-6 w-6 mb-1 text-blue-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Humidity</span>
              <span className="font-medium">{main?.humidity}%</span>
            </motion.div>

            <motion.div
              className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex flex-col items-center transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Wind className="h-6 w-6 mb-1 text-teal-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Wind</span>
              <span className="font-medium">{Math.round(wind?.speed)} m/s</span>
            </motion.div>

            <motion.div
              className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex flex-col items-center transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Cloud className="h-6 w-6 mb-1 text-gray-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Pressure</span>
              <span className="font-medium">{main?.pressure} hPa</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
