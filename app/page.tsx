'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Moon, 
  Sun, 
  Utensils, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell
} from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'
import { fetchPrayerTimes, getNextPrayer, formatCountdown, type PrayerTimes } from '@/lib/prayer-times'
import { recipes, getDayPlan, getCurrentWeek, woche1, type Recipe } from '@/data/ernaehrung'

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [city, setCity] = useState('Bad Kissingen')
  const [loading, setLoading] = useState(true)
  
  // Uhrzeit aktualisieren
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Gebetszeiten laden
  useEffect(() => {
    async function loadPrayerTimes() {
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
  
  // Nächstes Gebet
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null
  
  // Heute
  const today = new Date()
  const dayName = today.toLocaleDateString('de-DE', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
  
  // Tagesplan
  const startDate = new Date('2026-01-06') // Planstart
  const currentWeek = getCurrentWeek(startDate, today)
  const todayPlan = getDayPlan(today, currentWeek)
  
  // Rezepte für heute
  const fruehstueckRecipe = recipes.find(r => r.id === todayPlan.fruehstueck)
  const mittagRecipe = recipes.find(r => r.id === todayPlan.mittag)
  const snackRecipe = recipes.find(r => r.id === todayPlan.snack)
  const abendRecipe = recipes.find(r => r.id === todayPlan.abend)
  
  // Greeting basierend auf Uhrzeit
  const hour = currentTime.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  
  // Ist heute Workout Tag? (Mo, Do, So)
  const dayOfWeek = today.getDay()
  const isWorkoutDay = [0, 1, 4].includes(dayOfWeek) // 0=So, 1=Mo, 4=Do
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-display text-2xl text-white">{greeting}, Hannes</h1>
              <p className="text-dark-400">{dayName}, {dateStr}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display text-gold-500">
                {currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-dark-500 text-sm">{city}</p>
            </div>
          </div>
        </header>
        
        {/* Nächstes Gebet Card */}
        {nextPrayer && (
          <Link href="/gebete">
            <div className="card gold-border mb-6 hover:gold-glow transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <p className="text-dark-400 text-sm">Nächstes Gebet</p>
                    <p className="text-xl font-display text-white">{nextPrayer.prayer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display text-gold-500">{nextPrayer.prayer.time}</p>
                  <p className="text-dark-400 text-sm">in {formatCountdown(nextPrayer.minutesUntil)}</p>
                </div>
              </div>
            </div>
          </Link>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-dark-400 text-sm">Streak</span>
            </div>
            <p className="text-2xl font-display text-white">0 Tage</p>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-dark-400 text-sm">Woche</span>
            </div>
            <p className="text-2xl font-display text-white">{currentWeek}/3</p>
          </div>
        </div>
        
        {/* Workout Reminder (wenn Workout-Tag) */}
        {isWorkoutDay && (
          <div className="card border-purple-500/30 bg-purple-500/10 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="font-medium text-white">Heute ist Trainingstag!</p>
                  <p className="text-dark-400 text-sm">Wann möchtest du trainieren?</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </div>
          </div>
        )}
        
        {/* Mahlzeiten Übersicht */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-white">Heute auf dem Plan</h2>
            <Link href="/ernaehrung" className="text-gold-500 text-sm flex items-center gap-1">
              Alle Rezepte <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {/* Frühstück */}
            {fruehstueckRecipe && (
              <MealCard 
                time="07:30" 
                label="Frühstück" 
                recipe={fruehstueckRecipe} 
              />
            )}
            
            {/* Snack */}
            {snackRecipe && (
              <MealCard 
                time="16:00" 
                label="Snack" 
                recipe={snackRecipe} 
              />
            )}
            
            {/* Abendessen (kombiniert mit Mittag) */}
            {abendRecipe && mittagRecipe && (
              <MealCard 
                time="19:00" 
                label="Abendessen" 
                recipe={abendRecipe}
                extraRecipe={mittagRecipe}
              />
            )}
          </div>
        </div>
        
        {/* Habits Quick View */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-white">Habits</h2>
            <Link href="/habits" className="text-gold-500 text-sm flex items-center gap-1">
              Alle anzeigen <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="card">
            <div className="grid grid-cols-3 gap-4">
              {['📖 Koran', '💪 Workout', '📚 Lesen', '📱 Story', '🎬 Reel', '🤲 Dhikr'].map((habit, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-dark-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-dark-600 flex items-center justify-center">
                    <span className="text-lg">{habit.split(' ')[0]}</span>
                  </div>
                  <span className="text-xs text-dark-400">{habit.split(' ')[1]}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="flex items-center justify-between">
                <span className="text-dark-400 text-sm">0/6 erledigt</span>
                <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Supplements Reminder */}
        <div className="card border-teal-500/30 bg-teal-500/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💊</span>
            <div>
              <p className="font-medium text-white">Supplements nicht vergessen!</p>
              <p className="text-dark-400 text-sm">
                {hour < 12 ? 'Morgens: Schwarzkümmelöl + Probiotika' : 'Abends: Zink + Flohsamen + Butyrat'}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}

// Meal Card Component
function MealCard({ 
  time, 
  label, 
  recipe,
  extraRecipe 
}: { 
  time: string
  label: string
  recipe: Recipe
  extraRecipe?: Recipe
}) {
  const totalCalories = recipe.calories + (extraRecipe?.calories || 0)
  const totalProtein = recipe.protein + (extraRecipe?.protein || 0)
  
  return (
    <Link href={`/ernaehrung?recipe=${recipe.id}`}>
      <div className="card hover:border-gold-500/50 transition-all cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-dark-500 text-xs">{label}</p>
              <p className="text-gold-500 font-medium">{time}</p>
            </div>
            <div>
              <p className="font-medium text-white">
                {recipe.emoji} {recipe.name}
                {extraRecipe && <span className="text-dark-400"> + {extraRecipe.emoji} {extraRecipe.name}</span>}
              </p>
              <p className="text-dark-400 text-sm">
                {totalCalories} kcal • {totalProtein}g Protein
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-dark-400" />
        </div>
      </div>
    </Link>
  )
}
