'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Clock, MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'
import { 
  fetchPrayerTimes, 
  getNextPrayer, 
  getCurrentPrayer,
  minutesUntilPrayerEnd,
  formatCountdown,
  type PrayerTimes 
} from '@/lib/prayer-times'

interface PrayerCardProps {
  name: string
  nameArabic: string
  startTime: string
  endTime: string
  isActive: boolean
  isNext: boolean
  minutesUntil?: number
  minutesUntilEnd?: number
  colorClass: string
}

export default function GebetePage() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [city, setCity] = useState('Bad Kissingen')
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Load prayer times
  useEffect(() => {
    async function loadPrayerTimes() {
      setLoading(true)
      try {
        const data = await fetchPrayerTimes(city)
        setPrayerTimes(data.times)
      } catch (error) {
        console.error('Error loading prayer times:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPrayerTimes()
  }, [city])
  
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null
  
  // Prayer data with end times
  const prayers = prayerTimes ? [
    { 
      name: 'Fajr', 
      nameArabic: 'الفجر', 
      startTime: prayerTimes.fajr.time, 
      endTime: prayerTimes.fajrEnd,
      colorClass: 'prayer-fajr',
      icon: Moon
    },
    { 
      name: 'Dhuhr', 
      nameArabic: 'الظهر', 
      startTime: prayerTimes.dhuhr.time, 
      endTime: prayerTimes.dhuhrEnd,
      colorClass: 'prayer-dhuhr',
      icon: Sun
    },
    { 
      name: 'Asr', 
      nameArabic: 'العصر', 
      startTime: prayerTimes.asr.time, 
      endTime: prayerTimes.asrEnd,
      colorClass: 'prayer-asr',
      icon: Sun
    },
    { 
      name: 'Maghrib', 
      nameArabic: 'المغرب', 
      startTime: prayerTimes.maghrib.time, 
      endTime: prayerTimes.maghribEnd,
      colorClass: 'prayer-maghrib',
      icon: Sun
    },
    { 
      name: 'Isha', 
      nameArabic: 'العشاء', 
      startTime: prayerTimes.isha.time, 
      endTime: prayerTimes.ishaEnd,
      colorClass: 'prayer-isha',
      icon: Moon
    },
  ] : []
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-2xl text-white mb-2">🕌 Gebetszeiten</h1>
          <div className="flex items-center gap-2 text-dark-400">
            <MapPin className="w-4 h-4" />
            <span>{city}</span>
            <button 
              onClick={() => {
                const newCity = prompt('Stadt eingeben:', city)
                if (newCity) setCity(newCity)
              }}
              className="text-gold-500 text-sm ml-2"
            >
              Ändern
            </button>
          </div>
        </header>
        
        {/* Current Prayer Alert */}
        {currentPrayer && (
          <div className="card gold-border gold-glow mb-6 bg-gold-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center pulse-gold">
                <Moon className="w-6 h-6 text-gold-500" />
              </div>
              <div className="flex-1">
                <p className="text-gold-500 text-sm font-medium">Jetzt ist Gebetszeit!</p>
                <p className="text-xl font-display text-white">{currentPrayer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-dark-400 text-sm">Endet in</p>
                <p className="text-lg font-medium text-gold-500">
                  {formatCountdown(minutesUntilPrayerEnd(
                    currentPrayer.name === 'Fajr' ? prayerTimes!.fajrEnd :
                    currentPrayer.name === 'Dhuhr' ? prayerTimes!.dhuhrEnd :
                    currentPrayer.name === 'Asr' ? prayerTimes!.asrEnd :
                    currentPrayer.name === 'Maghrib' ? prayerTimes!.maghribEnd :
                    prayerTimes!.ishaEnd
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Next Prayer Card (wenn kein aktuelles Gebet) */}
        {!currentPrayer && nextPrayer && (
          <div className="card gold-border mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center">
                <Clock className="w-6 h-6 text-gold-500" />
              </div>
              <div className="flex-1">
                <p className="text-dark-400 text-sm">Nächstes Gebet</p>
                <p className="text-xl font-display text-white">{nextPrayer.prayer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display text-gold-500">{nextPrayer.prayer.time}</p>
                <p className="text-dark-400 text-sm">in {formatCountdown(nextPrayer.minutesUntil)}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* All Prayers */}
        <div className="space-y-3">
          {loading ? (
            <div className="card">
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-gold-500 animate-spin" />
              </div>
            </div>
          ) : (
            prayers.map((prayer) => {
              const isActive = currentPrayer?.name === prayer.name
              const isNext = !currentPrayer && nextPrayer?.prayer.name === prayer.name
              const endMinutes = minutesUntilPrayerEnd(prayer.endTime)
              
              return (
                <div
                  key={prayer.name}
                  className={`card transition-all ${
                    isActive 
                      ? 'gold-border gold-glow bg-gold-500/5' 
                      : isNext 
                        ? 'border-dark-600' 
                        : 'border-dark-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-gold-500/20' : 'bg-dark-800'
                      }`}>
                        <prayer.icon className={`w-5 h-5 ${isActive ? 'text-gold-500' : prayer.colorClass}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-display text-lg ${isActive ? 'text-gold-500' : 'text-white'}`}>
                            {prayer.name}
                          </p>
                          <span className="text-dark-500 text-sm">{prayer.nameArabic}</span>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-gold-500/20 text-gold-500 text-xs rounded-full">
                              Jetzt
                            </span>
                          )}
                          {isNext && (
                            <span className="px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded-full">
                              Nächstes
                            </span>
                          )}
                        </div>
                        {isActive && endMinutes > 0 && endMinutes <= 15 && (
                          <div className="flex items-center gap-1 text-orange-500 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>Endet in {formatCountdown(endMinutes)}!</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-dark-500 text-xs">Beginn</p>
                          <p className={`text-lg font-medium ${isActive ? 'text-gold-500' : 'text-white'}`}>
                            {prayer.startTime}
                          </p>
                        </div>
                        <div className="text-dark-600">→</div>
                        <div>
                          <p className="text-dark-500 text-xs">Ende</p>
                          <p className="text-lg font-medium text-dark-400">
                            {prayer.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {/* Info */}
        <div className="mt-8 p-4 bg-dark-900/50 rounded-xl">
          <h3 className="text-gold-500 font-medium mb-2">📌 Reminder-Einstellungen</h3>
          <p className="text-dark-400 text-sm">
            Du bekommst automatisch eine SMS:
          </p>
          <ul className="text-dark-400 text-sm mt-2 space-y-1">
            <li>• 10 Minuten vor Gebetsbeginn</li>
            <li>• 15 Minuten vor Gebetsende</li>
          </ul>
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
