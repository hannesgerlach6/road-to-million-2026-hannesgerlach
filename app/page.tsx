'use client'

import { useState, useEffect } from 'react'
import { 
  Sun, Moon, Sunrise, Sunset, Clock,
  Dumbbell, Utensils, Target, BookOpen, 
  Instagram, CheckCircle2, Circle, 
  ChevronRight, Flame, Trophy, Star,
  Calendar, TrendingUp, Heart, Zap,
  Settings, Send, Bell, MapPin,
  MessageCircle, Coffee, ChefHat,
  CalendarDays, CalendarRange, LayoutGrid
} from 'lucide-react'
import Link from 'next/link'

// Types
interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface Habit {
  id: string
  name: string
  icon: string
  completed: boolean
  streak: number
}

interface Workout {
  id: string
  name: string
  sets: number
  reps: string
  completed: boolean
}

interface Meal {
  id: string
  time: string
  name: string
  calories: number
  protein: number
  recipe?: string
  prepTime: string
}

interface UserSettings {
  phone: string
  city: string
  notificationsEnabled: boolean
}

type ViewMode = 'day' | 'week' | 'month'

// Toast Component
function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast flex items-center gap-3 ${type === 'error' ? 'border-red-500' : 'border-gold-500'}`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-green-400" />
      ) : (
        <span className="text-red-400">❌</span>
      )}
      <span>{message}</span>
    </div>
  )
}

// Prayer Times Component with Start-End Times
function PrayerTimesWidget({ city, onSendReminder }: { city: string; onSendReminder: (prayer: string, time: string) => void }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [nextPrayer, setNextPrayer] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Germany&method=2`
        )
        const data = await response.json()
        setPrayerTimes(data.data.timings)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching prayer times:', error)
        setLoading(false)
      }
    }
    fetchPrayerTimes()
  }, [city])

  useEffect(() => {
    if (!prayerTimes || !mounted) return

    const checkNextPrayer = () => {
      const now = new Date()
      const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ]

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number)
        const prayerTime = new Date(now)
        prayerTime.setHours(hours, minutes, 0)
        
        if (prayerTime > now) {
          setNextPrayer(prayer.name)
          return
        }
      }
      setNextPrayer('Fajr') // Nach Isha ist Fajr das nächste
    }

    checkNextPrayer()
    const interval = setInterval(checkNextPrayer, 60000)
    return () => clearInterval(interval)
  }, [prayerTimes, mounted])

  // Get end time for each prayer (when next prayer starts)
  const getPrayerEndTime = (prayerName: string): string => {
    if (!prayerTimes) return ''
    const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    const idx = order.indexOf(prayerName)
    if (idx === -1) return ''
    
    // Special cases
    if (prayerName === 'Fajr') return prayerTimes.Sunrise
    if (prayerName === 'Isha') return '23:59'
    
    const nextPrayerName = order[idx + 1]
    return prayerTimes[nextPrayerName as keyof PrayerTimes] || ''
  }

  const prayerIcons: Record<string, React.ReactNode> = {
    Fajr: <Sunrise className="w-5 h-5" />,
    Dhuhr: <Sun className="w-5 h-5" />,
    Asr: <Sun className="w-5 h-5 opacity-70" />,
    Maghrib: <Sunset className="w-5 h-5" />,
    Isha: <Moon className="w-5 h-5" />,
  }

  if (loading || !mounted) {
    return (
      <div className="bg-dark-900/50 gold-border rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-dark-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-dark-800 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover islamic-pattern">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Gebetszeiten
        </h2>
        <span className="text-dark-400 text-sm flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {city}
        </span>
      </div>

      <div className="space-y-3">
        {prayerTimes && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
          <div 
            key={prayer}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              nextPrayer === prayer 
                ? 'bg-gold-500/20 border border-gold-500/50' 
                : 'bg-dark-800/50 hover:bg-dark-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={nextPrayer === prayer ? 'text-gold-400' : 'text-dark-400'}>
                {prayerIcons[prayer]}
              </span>
              <div>
                <span className={`font-medium ${nextPrayer === prayer ? 'text-gold-300' : 'text-dark-200'}`}>
                  {prayer}
                </span>
                {nextPrayer === prayer && (
                  <span className="ml-2 text-xs bg-gold-500/30 text-gold-300 px-2 py-0.5 rounded-full">
                    Nächstes
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className={`font-mono ${nextPrayer === prayer ? 'text-gold-400' : 'text-dark-300'}`}>
                  {prayerTimes[prayer as keyof PrayerTimes]}
                </span>
                <span className="text-dark-500 text-xs ml-1">
                  - {getPrayerEndTime(prayer)}
                </span>
              </div>
              <button
                onClick={() => onSendReminder(prayer, prayerTimes[prayer as keyof PrayerTimes])}
                className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-400 hover:text-gold-400 transition-all"
                title="Reminder senden"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Habit Tracker Component
function HabitTracker({ habits, setHabits }: { habits: Habit[]; setHabits: (h: Habit[]) => void }) {
  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id 
        ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : h.streak - 1 }
        : h
    ))
  }

  const completedCount = habits.filter(h => h.completed).length
  const progress = (completedCount / habits.length) * 100

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Habits
        </h2>
        <span className="text-dark-400 text-sm">{completedCount}/{habits.length}</span>
      </div>

      <div className="w-full h-2 bg-dark-800 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              habit.completed 
                ? 'bg-gold-500/20 border border-gold-500/30' 
                : 'bg-dark-800/50 hover:bg-dark-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{habit.icon}</span>
              <span className={`font-medium ${habit.completed ? 'text-gold-300 line-through' : 'text-dark-200'}`}>
                {habit.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-dark-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                {habit.streak}
              </span>
              {habit.completed ? (
                <CheckCircle2 className="w-5 h-5 text-gold-400" />
              ) : (
                <Circle className="w-5 h-5 text-dark-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Workout Widget Component
function WorkoutWidget({ workouts, setWorkouts }: { workouts: Workout[]; setWorkouts: (w: Workout[]) => void }) {
  const [isWorkoutDay, setIsWorkoutDay] = useState(true)

  useEffect(() => {
    const dayOfWeek = new Date().getDay()
    setIsWorkoutDay([1, 3, 5].includes(dayOfWeek)) // Mo, Mi, Fr
  }, [])

  const toggleWorkout = (id: string) => {
    setWorkouts(workouts.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ))
  }

  const completedCount = workouts.filter(w => w.completed).length

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <Dumbbell className="w-5 h-5" />
          Workout
        </h2>
        {isWorkoutDay ? (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            Trainingstag
          </span>
        ) : (
          <span className="text-xs bg-dark-700 text-dark-400 px-2 py-1 rounded-full">
            Ruhetag
          </span>
        )}
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => toggleWorkout(workout.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              workout.completed 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-dark-800/50 hover:bg-dark-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {workout.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <Circle className="w-5 h-5 text-dark-500" />
              )}
              <span className={`font-medium ${workout.completed ? 'text-green-300 line-through' : 'text-dark-200'}`}>
                {workout.name}
              </span>
            </div>
            <span className="text-sm text-dark-400">
              {workout.sets}x{workout.reps}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between">
        <span className="text-dark-400 text-sm">Fortschritt</span>
        <span className="text-gold-400 font-medium">{completedCount}/{workouts.length}</span>
      </div>
    </div>
  )
}

// Meal Plan Widget
function MealPlanWidget({ meals, onSendMealReminder }: { meals: Meal[]; onSendMealReminder: (meal: Meal) => void }) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0)

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          Meal Plan
        </h2>
        <span className="text-xs bg-dark-700 text-dark-400 px-2 py-1 rounded-full flex items-center gap-1">
          <ChefHat className="w-3 h-3" />
          Heute
        </span>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-dark-800/50 rounded-xl overflow-hidden">
            <div 
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-dark-800 transition-all"
              onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gold-400 font-mono">{meal.time}</span>
                  <span className="text-xs text-dark-500">•</span>
                  <span className="text-xs text-dark-400">{meal.prepTime}</span>
                </div>
                <p className="text-dark-200 font-medium">{meal.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-dark-400">{meal.calories} kcal</span>
                  <span className="text-xs text-green-400">{meal.protein}g Protein</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSendMealReminder(meal)
                  }}
                  className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-400 hover:text-gold-400 transition-all"
                  title="Rezept senden"
                >
                  <Send className="w-4 h-4" />
                </button>
                <ChevronRight className={`w-5 h-5 text-dark-500 transition-transform ${expandedMeal === meal.id ? 'rotate-90' : ''}`} />
              </div>
            </div>
            {expandedMeal === meal.id && meal.recipe && (
              <div className="px-3 pb-3 pt-0 border-t border-dark-700">
                <p className="text-sm text-dark-300 whitespace-pre-line mt-3">{meal.recipe}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-700 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gold-400">{totalCalories}</p>
          <p className="text-xs text-dark-400">Kalorien</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{totalProtein}g</p>
          <p className="text-xs text-dark-400">Protein</p>
        </div>
      </div>
    </div>
  )
}

// Goals Widget
function GoalsWidget() {
  const goals = [
    { category: 'Business', goal: '€1M Revenue', progress: 48, icon: <TrendingUp className="w-4 h-4" /> },
    { category: 'Fitness', goal: '10 Klimmzüge clean', progress: 70, icon: <Dumbbell className="w-4 h-4" /> },
    { category: 'Deen', goal: 'Koran durchlesen', progress: 35, icon: <BookOpen className="w-4 h-4" /> },
    { category: 'Health', goal: '75kg Körpergewicht', progress: 85, icon: <Heart className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <Target className="w-5 h-5" />
          2026 Goals
        </h2>
        <Trophy className="w-5 h-5 text-gold-500" />
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gold-400">{goal.icon}</span>
                <span className="text-dark-300 text-sm">{goal.category}</span>
              </div>
              <span className="text-gold-400 text-sm font-medium">{goal.progress}%</span>
            </div>
            <p className="text-dark-200 font-medium">{goal.goal}</p>
            <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Quick Actions Component
function QuickActions({ onAction }: { onAction: (type: string) => void }) {
  const actions = [
    { id: 'morning', label: 'Morgen-Summary', icon: <Coffee className="w-4 h-4" />, color: 'text-orange-400' },
    { id: 'koran', label: 'Koran Reminder', icon: <BookOpen className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'workout', label: 'Workout Reminder', icon: <Dumbbell className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'evening', label: 'Abend-Check', icon: <Moon className="w-4 h-4" />, color: 'text-purple-400' },
  ]

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Test Notifications
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="flex items-center gap-2 p-3 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-all text-left"
          >
            <span className={action.color}>{action.icon}</span>
            <span className="text-dark-200 text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// View Mode Selector
function ViewSelector({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-2 bg-dark-800/50 p-1 rounded-xl">
      <button
        onClick={() => setViewMode('day')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          viewMode === 'day' ? 'bg-gold-500/20 text-gold-400' : 'text-dark-400 hover:text-dark-200'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm">Tag</span>
      </button>
      <button
        onClick={() => setViewMode('week')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          viewMode === 'week' ? 'bg-gold-500/20 text-gold-400' : 'text-dark-400 hover:text-dark-200'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span className="text-sm">Woche</span>
      </button>
      <button
        onClick={() => setViewMode('month')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          viewMode === 'month' ? 'bg-gold-500/20 text-gold-400' : 'text-dark-400 hover:text-dark-200'
        }`}
      >
        <CalendarRange className="w-4 h-4" />
        <span className="text-sm">Monat</span>
      </button>
    </div>
  )
}

// Week View Component
function WeekView({ habits, selectedDate, setSelectedDate }: { 
  habits: Habit[]
  selectedDate: Date
  setSelectedDate: (d: Date) => void 
}) {
  const [weekData, setWeekData] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load week data from localStorage
    const saved = localStorage.getItem('r2m-week-data')
    if (saved) {
      setWeekData(JSON.parse(saved))
    }
  }, [])

  if (!mounted) return null

  const getWeekDays = () => {
    const days = []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1) // Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
      <h2 className="text-xl font-display text-gold-400 mb-6 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" />
        Wochenübersicht
      </h2>

      {/* Week Header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div></div>
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString()
          const isSelected = day.toDateString() === selectedDate.toDateString()
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`text-center p-2 rounded-lg transition-all ${
                isToday ? 'bg-gold-500/20 text-gold-400' : 
                isSelected ? 'bg-dark-700 text-white' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              <div className="text-xs">{dayNames[i]}</div>
              <div className="text-lg font-medium">{day.getDate()}</div>
            </button>
          )
        })}
      </div>

      {/* Habits Grid */}
      <div className="space-y-2">
        {habits.map((habit) => (
          <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
            <div className="flex items-center gap-2 text-dark-300 text-sm truncate">
              <span>{habit.icon}</span>
              <span className="truncate">{habit.name}</span>
            </div>
            {weekDays.map((day, i) => {
              const dateKey = day.toISOString().split('T')[0]
              const habitKey = `${dateKey}-${habit.id}`
              const isCompleted = weekData[habitKey] || false
              const isToday = day.toDateString() === new Date().toDateString()
              const isFuture = day > new Date()

              return (
                <button
                  key={i}
                  disabled={isFuture}
                  onClick={() => {
                    const newData = { ...weekData, [habitKey]: !isCompleted }
                    setWeekData(newData)
                    localStorage.setItem('r2m-week-data', JSON.stringify(newData))
                  }}
                  className={`h-8 rounded-lg flex items-center justify-center transition-all ${
                    isFuture ? 'bg-dark-800/30 cursor-not-allowed' :
                    isCompleted ? 'bg-green-500/30 text-green-400' : 
                    isToday ? 'bg-gold-500/10 text-dark-500 hover:bg-gold-500/20' :
                    'bg-dark-800/50 text-dark-500 hover:bg-dark-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// Month View Component  
function MonthView({ habits, selectedDate, setSelectedDate }: {
  habits: Habit[]
  selectedDate: Date
  setSelectedDate: (d: Date) => void
}) {
  const [monthData, setMonthData] = useState<Record<string, number>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('r2m-week-data')
    if (saved) {
      const weekData = JSON.parse(saved)
      // Count completed habits per day
      const counts: Record<string, number> = {}
      Object.keys(weekData).forEach(key => {
        if (weekData[key]) {
          const dateKey = key.split('-').slice(0, 3).join('-')
          counts[dateKey] = (counts[dateKey] || 0) + 1
        }
      })
      setMonthData(counts)
    }
  }, [])

  if (!mounted) return null

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    // Add empty days for start of week
    const startPadding = (firstDay.getDay() + 6) % 7 // Monday = 0
    for (let i = 0; i < startPadding; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const days = getDaysInMonth()
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setSelectedDate(newDate)
  }

  return (
    <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-gold-400 flex items-center gap-2">
          <CalendarRange className="w-5 h-5" />
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 bg-dark-800 rounded-lg hover:bg-dark-700">
            <ChevronRight className="w-4 h-4 rotate-180 text-dark-400" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 bg-dark-800 rounded-lg hover:bg-dark-700">
            <ChevronRight className="w-4 h-4 text-dark-400" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
          <div key={d} className="text-center text-dark-500 text-xs py-2">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} className="h-10"></div>
          
          const dateKey = day.toISOString().split('T')[0]
          const completedCount = monthData[dateKey] || 0
          const isToday = day.toDateString() === new Date().toDateString()
          const isSelected = day.toDateString() === selectedDate.toDateString()
          
          // Color based on completion
          let bgColor = 'bg-dark-800/30'
          if (completedCount >= 6) bgColor = 'bg-green-500/40'
          else if (completedCount >= 4) bgColor = 'bg-green-500/25'
          else if (completedCount >= 2) bgColor = 'bg-gold-500/20'
          else if (completedCount >= 1) bgColor = 'bg-gold-500/10'

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`h-10 rounded-lg flex flex-col items-center justify-center transition-all ${bgColor} ${
                isToday ? 'ring-2 ring-gold-500' : ''
              } ${isSelected ? 'ring-2 ring-white' : ''}`}
            >
              <span className="text-sm text-dark-200">{day.getDate()}</span>
              {completedCount > 0 && (
                <span className="text-[10px] text-dark-400">{completedCount}/{habits.length}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-dark-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-dark-800/30"></div>
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gold-500/20"></div>
          <span>1-3</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/25"></div>
          <span>4-5</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/40"></div>
          <span>6+</span>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard
export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [greeting, setGreeting] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [sending, setSending] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Settings State
  const [settings, setSettings] = useState<UserSettings>({
    phone: '',
    city: 'Bad Kissingen',
    notificationsEnabled: true,
  })

  // Habits State
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Koran lesen', icon: '📖', completed: false, streak: 12 },
    { id: '2', name: 'Workout', icon: '💪', completed: false, streak: 8 },
    { id: '3', name: 'Buch lesen', icon: '📚', completed: false, streak: 5 },
    { id: '4', name: 'Instagram Story', icon: '📱', completed: false, streak: 15 },
    { id: '5', name: 'Reel posten', icon: '🎬', completed: false, streak: 3 },
    { id: '6', name: 'Dhikr', icon: '🤲', completed: false, streak: 20 },
  ])

  // Workouts State
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: '1', name: 'Klimmzüge', sets: 4, reps: '8-10', completed: false },
    { id: '2', name: 'Dips', sets: 4, reps: '10-12', completed: false },
    { id: '3', name: 'Rudern', sets: 4, reps: '10-12', completed: false },
    { id: '4', name: 'Pike Push-ups', sets: 3, reps: '8-10', completed: false },
    { id: '5', name: 'Hanging Leg Raises', sets: 3, reps: '12-15', completed: false },
  ])

  // Meals State
  const [meals] = useState<Meal[]>([
    { 
      id: '1', 
      time: '08:00', 
      name: 'Haferflocken + Banane + Protein', 
      calories: 450, 
      protein: 35,
      prepTime: '5 Min',
      recipe: '80g Haferflocken\n300ml Milch\n1 Banane\n30g Whey Protein\n\nHaferflocken mit Milch aufkochen, Banane reinschneiden, Protein unterrühren.'
    },
    { 
      id: '2', 
      time: '12:30', 
      name: 'Reis + Hähnchen + Gemüse', 
      calories: 650, 
      protein: 50,
      prepTime: '25 Min',
      recipe: '150g Reis\n200g Hähnchenbrust\n200g Brokkoli/Paprika\n\nReis kochen, Hähnchen in der Pfanne braten, Gemüse dünsten. Würzen nach Geschmack.'
    },
    { 
      id: '3', 
      time: '16:00', 
      name: 'Snack: Greek Yogurt + Nüsse', 
      calories: 300, 
      protein: 25,
      prepTime: '2 Min',
      recipe: '200g Greek Yogurt\n30g Mandeln/Walnüsse\nHonig nach Geschmack'
    },
    { 
      id: '4', 
      time: '19:30', 
      name: 'Kartoffeln + Lachs + Salat', 
      calories: 550, 
      protein: 45,
      prepTime: '30 Min',
      recipe: '300g Kartoffeln\n200g Lachs\nGemischter Salat\n\nKartoffeln kochen, Lachs im Ofen bei 200°C für 15 Min, Salat anmachen.'
    },
  ])

  // Hydration fix - only run on client
  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    if (!mounted) return

    const savedSettings = localStorage.getItem('r2m-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedHabits = localStorage.getItem('r2m-habits')
    const habitsDate = localStorage.getItem('r2m-habits-date')
    const today = new Date().toDateString()
    
    if (savedHabits && habitsDate === today) {
      setHabits(JSON.parse(savedHabits))
    }

    const savedWorkouts = localStorage.getItem('r2m-workouts')
    const workoutsDate = localStorage.getItem('r2m-workouts-date')
    
    if (savedWorkouts && workoutsDate === today) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [mounted])

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('r2m-settings', JSON.stringify(settings))
  }, [settings, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('r2m-habits', JSON.stringify(habits))
    localStorage.setItem('r2m-habits-date', new Date().toDateString())
  }, [habits, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('r2m-workouts', JSON.stringify(workouts))
    localStorage.setItem('r2m-workouts-date', new Date().toDateString())
  }, [workouts, mounted])

  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Sabah al-Khair')
    else setGreeting('Masa al-Khair')
    
    return () => clearInterval(timer)
  }, [mounted])

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  // Show loading state while hydrating
  if (!mounted || !currentTime) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Lade...</p>
        </div>
      </main>
    )
  }

  // Send notification
  const sendNotification = async (type: string, data: any) => {
    if (!settings.phone) {
      setToast({ message: 'Bitte Telefonnummer in Einstellungen eingeben!', type: 'error' })
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/superchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, to: settings.phone, data }),
      })

      const result = await response.json()
      
      if (result.success) {
        setToast({ message: 'Nachricht gesendet! ✅', type: 'success' })
      } else {
        setToast({ message: 'Fehler beim Senden: ' + (result.error || 'Unbekannt'), type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Netzwerk-Fehler!', type: 'error' })
    }
    setSending(false)
  }

  const handlePrayerReminder = (prayer: string, time: string) => {
    sendNotification('prayer', { prayer, time })
  }

  const handleMealReminder = (meal: Meal) => {
    sendNotification('meal', meal)
  }

  const handleQuickAction = async (type: string) => {
    switch (type) {
      case 'morning':
        // Fetch prayer times first
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(settings.city)}&country=Germany&method=2`
          )
          const data = await response.json()
          const timings = data.data.timings

          sendNotification('morning', {
            prayers: [
              { name: 'Fajr', time: timings.Fajr },
              { name: 'Dhuhr', time: timings.Dhuhr },
              { name: 'Asr', time: timings.Asr },
              { name: 'Maghrib', time: timings.Maghrib },
              { name: 'Isha', time: timings.Isha },
            ],
            meals: meals.map(m => ({ time: m.time, name: m.name })),
            habits: habits.map(h => h.name),
            workout: [1, 3, 5].includes(new Date().getDay()) 
              ? 'Klimmzüge, Dips, Rudern, Pike Push-ups, Leg Raises' 
              : undefined,
          })
        } catch (error) {
          setToast({ message: 'Fehler beim Laden der Gebetszeiten', type: 'error' })
        }
        break
      case 'koran':
        sendNotification('koran', {})
        break
      case 'workout':
        sendNotification('workout', { exercises: workouts })
        break
      case 'evening':
        sendNotification('evening', {
          completed: habits.filter(h => h.completed).length,
          total: habits.length,
          missing: habits.filter(h => !h.completed).map(h => h.name),
        })
        break
    }
  }

  const completedHabits = habits.filter(h => h.completed).length

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-gold-500 text-lg font-display mb-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <h1 className="text-3xl md:text-4xl font-display text-white mb-2">
              {greeting}, <span className="text-gold-400">Hannes</span>
            </h1>
            <p className="text-dark-400">{formatDate(currentTime)}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-4xl md:text-5xl font-mono text-gold-400 tabular-nums">
                {currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-dark-500 text-sm mt-1">Road to Million 2026</p>
            </div>
            <Link 
              href="/einstellungen"
              className="p-3 bg-dark-800 hover:bg-dark-700 rounded-xl transition-all"
            >
              <Settings className="w-6 h-6 text-dark-400 hover:text-gold-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* View Selector */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ViewSelector viewMode={viewMode} setViewMode={setViewMode} />
        {viewMode !== 'day' && (
          <button 
            onClick={() => setSelectedDate(new Date())}
            className="text-sm text-gold-400 hover:text-gold-300"
          >
            Heute
          </button>
        )}
      </div>

      {/* Phone Number Alert */}
      {!settings.phone && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-400" />
              <span className="text-red-300">Telefonnummer fehlt! Notifications können nicht gesendet werden.</span>
            </div>
            <Link href="/einstellungen" className="btn-gold text-sm py-2">
              Einstellungen
            </Link>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="max-w-7xl mx-auto mb-8">
          <WeekView habits={habits} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="max-w-7xl mx-auto mb-8">
          <MonthView habits={habits} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      )}

      {/* Quick Stats - Only on Day View */}
      {viewMode === 'day' && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Streak', value: `${Math.max(...habits.map(h => h.streak))} Tage`, icon: <Flame className="w-5 h-5 text-orange-500" /> },
            { label: 'Habits', value: `${completedHabits}/${habits.length}`, icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
            { label: 'Workouts', value: '3/Woche', icon: <Dumbbell className="w-5 h-5 text-blue-500" /> },
            { label: 'Stadt', value: settings.city, icon: <MapPin className="w-5 h-5 text-gold-500" /> },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-dark-900/50 gold-border rounded-xl p-4 flex items-center gap-3 card-hover"
            >
              {stat.icon}
              <div>
                <p className="text-dark-400 text-xs">{stat.label}</p>
                <p className="text-white font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid - Day View */}
      {viewMode === 'day' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PrayerTimesWidget city={settings.city} onSendReminder={handlePrayerReminder} />
          <HabitTracker habits={habits} setHabits={setHabits} />
          <WorkoutWidget workouts={workouts} setWorkouts={setWorkouts} />
          <MealPlanWidget meals={meals} onSendMealReminder={handleMealReminder} />
          <GoalsWidget />
          <QuickActions onAction={handleQuickAction} />
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-dark-500 text-sm">
        <p>Made with ❤️ and Tawakkul</p>
      </footer>

      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Loading Overlay */}
      {sending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-2xl flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-white">Sende Nachricht...</span>
          </div>
        </div>
      )}
    </main>
  )
}
