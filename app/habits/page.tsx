'use client'

import { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  Flame,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'

interface Habit {
  id: string
  name: string
  emoji: string
  completed: boolean
  streak: number
}

const defaultHabits: Habit[] = [
  { id: '1', name: 'Koran lesen', emoji: '📖', completed: false, streak: 0 },
  { id: '2', name: 'Workout', emoji: '💪', completed: false, streak: 0 },
  { id: '3', name: 'Buch lesen', emoji: '📚', completed: false, streak: 0 },
  { id: '4', name: 'Instagram Story', emoji: '📱', completed: false, streak: 0 },
  { id: '5', name: 'Reel posten', emoji: '🎬', completed: false, streak: 0 },
  { id: '6', name: 'Dhikr', emoji: '🤲', completed: false, streak: 0 },
]

const emojiOptions = ['📖', '💪', '📚', '📱', '🎬', '🤲', '🧘', '💧', '🥗', '😴', '🚶', '💻', '📝', '🎯', '⏰', '🌅']

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const completedCount = habits.filter(h => h.completed).length
  const totalCount = habits.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  
  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ))
  }
  
  const addHabit = (name: string, emoji: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      completed: false,
      streak: 0,
    }
    setHabits([...habits, newHabit])
    setShowAddModal(false)
  }
  
  const updateHabit = (id: string, name: string, emoji: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, name, emoji } : h
    ))
    setEditingHabit(null)
  }
  
  const deleteHabit = (id: string) => {
    if (confirm('Habit wirklich löschen?')) {
      setHabits(habits.filter(h => h.id !== id))
    }
  }
  
  const dayName = currentDate.toLocaleDateString('de-DE', { weekday: 'long' })
  const dateStr = currentDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl text-white">✅ Habits</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-gold flex items-center gap-2 py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              Neu
            </button>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() - 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-dark-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-dark-400" />
            </button>
            <div className="text-center">
              <p className="font-medium text-white">{dayName}</p>
              <p className="text-dark-400 text-sm">{dateStr}</p>
            </div>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() + 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-dark-800 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </header>
        
        {/* Progress Card */}
        <div className="card gold-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-dark-400 text-sm">Fortschritt heute</p>
              <p className="text-3xl font-display text-white">
                {completedCount}<span className="text-dark-500">/{totalCount}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-2xl font-display text-white">0</p>
                <p className="text-dark-500 text-xs">Tage Streak</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {progress === 100 && (
            <div className="mt-4 flex items-center gap-2 text-green-500">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Alle Habits erledigt! Mashallah! 🔥</span>
            </div>
          )}
        </div>
        
        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`card transition-all ${
                habit.completed 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : 'hover:border-dark-600'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-green-500'
                      : 'bg-dark-800 hover:bg-dark-700 border-2 border-dark-600'
                  }`}
                >
                  {habit.completed ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-2xl">{habit.emoji}</span>
                  )}
                </button>
                
                {/* Content */}
                <div className="flex-1">
                  <p className={`font-medium ${habit.completed ? 'text-dark-400 line-through' : 'text-white'}`}>
                    {habit.name}
                  </p>
                  {habit.streak > 0 && (
                    <p className="text-dark-500 text-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {habit.streak} Tage Streak
                    </p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {habits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-500 mb-4">Noch keine Habits angelegt</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-gold"
            >
              Erstes Habit erstellen
            </button>
          </div>
        )}
      </main>
      
      {/* Add/Edit Modal */}
      {(showAddModal || editingHabit) && (
        <HabitModal
          habit={editingHabit}
          onSave={(name, emoji) => {
            if (editingHabit) {
              updateHabit(editingHabit.id, name, emoji)
            } else {
              addHabit(name, emoji)
            }
          }}
          onClose={() => {
            setShowAddModal(false)
            setEditingHabit(null)
          }}
        />
      )}
      
      <BottomNav />
    </div>
  )
}

// Add/Edit Habit Modal
function HabitModal({ 
  habit, 
  onSave, 
  onClose 
}: { 
  habit: Habit | null
  onSave: (name: string, emoji: string) => void
  onClose: () => void 
}) {
  const [name, setName] = useState(habit?.name || '')
  const [emoji, setEmoji] = useState(habit?.emoji || '🎯')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim(), emoji)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-900 rounded-2xl border border-dark-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-white">
            {habit ? 'Habit bearbeiten' : 'Neues Habit'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-800 rounded-lg">
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emoji Picker */}
          <div>
            <label className="block text-dark-400 text-sm mb-2">Emoji</label>
            <div className="grid grid-cols-8 gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    emoji === e 
                      ? 'bg-gold-500/20 border-2 border-gold-500' 
                      : 'bg-dark-800 hover:bg-dark-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          
          {/* Name Input */}
          <div>
            <label className="block text-dark-400 text-sm mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Koran lesen"
              className="w-full"
              autoFocus
            />
          </div>
          
          {/* Submit */}
          <button type="submit" className="btn-gold w-full">
            {habit ? 'Speichern' : 'Erstellen'}
          </button>
        </form>
      </div>
    </div>
  )
}
