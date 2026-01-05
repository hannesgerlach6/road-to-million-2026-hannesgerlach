'use client'

import { useState, useEffect } from 'react'
import { 
  Sun, Moon, Sunrise, Sunset, Clock,
  Dumbbell, Utensils, Target, BookOpen, 
  Instagram, CheckCircle2, Circle, 
  ChevronRight, Flame, Trophy, Star,
  Calendar, TrendingUp, Heart, Zap,
  Settings, Send, Bell, MapPin,
  MessageCircle, Coffee, ChefHat
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

// Prayer Times Component
function PrayerTimesWidget({ city, onSendReminder }: { city: string; onSendReminder: (prayer: string, time: string) => void }) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState<string>('')
  const [loading, setLoading] = useState(true)

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

    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [city])

  useEffect(() => {
    if (!prayerTimes) return

    const now = currentTime
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
        break
      }
    }
  }, [prayerTimes, currentTime])

  const prayerIcons: Record<string, React.ReactNode> = {
    Fajr: <Sunrise className="w-5 h-5" />,
    Dhuhr: <Sun className="w-5 h-5" />,
    Asr: <Sun className="w-5 h-5 opacity-70" />,
    Maghrib: <Sunset className="w-5 h-5" />,
    Isha: <Moon className="w-5 h-5" />,
  }

  if (loading) {
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
              <span className={`font-medium ${nextPrayer === prayer ? 'text-gold-300' : 'text-dark-200'}`}>
                {prayer}
              </span>
              {nextPrayer === prayer && (
                <span className="text-xs bg-gold-500/30 text-gold-300 px-2 py-0.5 rounded-full">
                  Nächstes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono ${nextPrayer === prayer ? 'text-gold-400' : 'text-dark-300'}`}>
                {prayerTimes[prayer as keyof PrayerTimes]}
              </span>
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

// Main Dashboard
export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [sending, setSending] = useState(false)

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

  // Load settings from localStorage
  useEffect(() => {
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
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('r2m-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('r2m-habits', JSON.stringify(habits))
    localStorage.setItem('r2m-habits-date', new Date().toDateString())
  }, [habits])

  useEffect(() => {
    localStorage.setItem('r2m-workouts', JSON.stringify(workouts))
    localStorage.setItem('r2m-workouts-date', new Date().toDateString())
  }, [workouts])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Sabah al-Khair')
    else if (hour < 17) setGreeting('Masa al-Khair')
    else setGreeting('Masa al-Khair')
    
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
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

      {/* Quick Stats */}
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

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PrayerTimesWidget city={settings.city} onSendReminder={handlePrayerReminder} />
        <HabitTracker habits={habits} setHabits={setHabits} />
        <WorkoutWidget workouts={workouts} setWorkouts={setWorkouts} />
        <MealPlanWidget meals={meals} onSendMealReminder={handleMealReminder} />
        <GoalsWidget />
        <QuickActions onAction={handleQuickAction} />
      </div>

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
