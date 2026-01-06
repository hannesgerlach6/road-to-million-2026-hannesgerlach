// Prayer Times API Helper
// Using Aladhan API for accurate prayer times

export interface PrayerTime {
  name: string
  nameArabic: string
  time: string // HH:MM
  timestamp: Date
}

export interface PrayerTimes {
  fajr: PrayerTime
  sunrise: PrayerTime
  dhuhr: PrayerTime
  asr: PrayerTime
  maghrib: PrayerTime
  isha: PrayerTime
  // Gebetsende Zeiten
  fajrEnd: string // = Sunrise
  dhuhrEnd: string // = Asr
  asrEnd: string // = Maghrib
  maghribEnd: string // = Isha
  ishaEnd: string // = Fajr (nächster Tag) oder Mitternacht
}

export interface PrayerTimesResponse {
  times: PrayerTimes
  date: string
  city: string
}

export async function fetchPrayerTimes(city: string, country: string = 'Germany'): Promise<PrayerTimesResponse> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times')
    }
    
    const data = await response.json()
    const timings = data.data.timings
    const dateInfo = data.data.date
    
    const today = new Date()
    
    const createPrayerTime = (name: string, nameArabic: string, timeStr: string): PrayerTime => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      const timestamp = new Date(today)
      timestamp.setHours(hours, minutes, 0, 0)
      return { name, nameArabic, time: timeStr, timestamp }
    }
    
    const times: PrayerTimes = {
      fajr: createPrayerTime('Fajr', 'الفجر', timings.Fajr),
      sunrise: createPrayerTime('Sunrise', 'الشروق', timings.Sunrise),
      dhuhr: createPrayerTime('Dhuhr', 'الظهر', timings.Dhuhr),
      asr: createPrayerTime('Asr', 'العصر', timings.Asr),
      maghrib: createPrayerTime('Maghrib', 'المغرب', timings.Maghrib),
      isha: createPrayerTime('Isha', 'العشاء', timings.Isha),
      // Gebetsende = Beginn des nächsten Gebets
      fajrEnd: timings.Sunrise,
      dhuhrEnd: timings.Asr,
      asrEnd: timings.Maghrib,
      maghribEnd: timings.Isha,
      ishaEnd: timings.Midnight || '23:59', // Mitternacht oder Fajr nächster Tag
    }
    
    return {
      times,
      date: dateInfo.readable,
      city,
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    throw error
  }
}

// Helper: Minuten zu Zeit (relativ zu einem Zeitpunkt)
export function addMinutesToTime(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`
}

// Helper: Zeit in Minuten seit Mitternacht
export function timeToMinutes(timeStr: string): number {
  const [hours, mins] = timeStr.split(':').map(Number)
  return hours * 60 + mins
}

// Helper: Ist es Zeit für ein Gebet? (innerhalb der Gebetszeit)
export function isPrayerTime(prayerStart: string, prayerEnd: string): boolean {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = timeToMinutes(prayerStart)
  const endMinutes = timeToMinutes(prayerEnd)
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes
}

// Helper: Minuten bis zum nächsten Gebet
export function minutesUntilPrayer(prayerTime: string): number {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const prayerMinutes = timeToMinutes(prayerTime)
  
  if (prayerMinutes > currentMinutes) {
    return prayerMinutes - currentMinutes
  } else {
    // Nächster Tag
    return (24 * 60 - currentMinutes) + prayerMinutes
  }
}

// Helper: Minuten bis Gebetsende
export function minutesUntilPrayerEnd(prayerEnd: string): number {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const endMinutes = timeToMinutes(prayerEnd)
  
  if (endMinutes > currentMinutes) {
    return endMinutes - currentMinutes
  }
  return 0
}

// Helper: Welches Gebet ist als nächstes?
export function getNextPrayer(times: PrayerTimes): { prayer: PrayerTime; minutesUntil: number } {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  const prayers = [times.fajr, times.dhuhr, times.asr, times.maghrib, times.isha]
  
  for (const prayer of prayers) {
    const prayerMinutes = timeToMinutes(prayer.time)
    if (prayerMinutes > currentMinutes) {
      return { prayer, minutesUntil: prayerMinutes - currentMinutes }
    }
  }
  
  // Wenn alle Gebete vorbei sind, ist Fajr morgen das nächste
  const fajrMinutes = timeToMinutes(times.fajr.time)
  return { 
    prayer: times.fajr, 
    minutesUntil: (24 * 60 - currentMinutes) + fajrMinutes 
  }
}

// Helper: Aktuelles Gebet (wenn man gerade in einer Gebetszeit ist)
export function getCurrentPrayer(times: PrayerTimes): PrayerTime | null {
  if (isPrayerTime(times.fajr.time, times.fajrEnd)) return times.fajr
  if (isPrayerTime(times.dhuhr.time, times.dhuhrEnd)) return times.dhuhr
  if (isPrayerTime(times.asr.time, times.asrEnd)) return times.asr
  if (isPrayerTime(times.maghrib.time, times.maghribEnd)) return times.maghrib
  if (isPrayerTime(times.isha.time, times.ishaEnd)) return times.isha
  return null
}

// Format Zeit für Anzeige
export function formatTime(timeStr: string): string {
  return timeStr // Bereits im Format HH:MM
}

// Format Countdown
export function formatCountdown(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} Min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}
