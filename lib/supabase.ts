import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface UserSettings {
  id: string
  user_id: string
  phone: string
  city: string
  notifications_enabled: boolean
  workout_days: string[] // ['montag', 'donnerstag', 'sonntag']
  meal_count: number // 2, 3, oder 4
  fajr_offset_minutes: number // Aufstehen nach Fajr (default: 20)
  prayer_end_reminder_minutes: number // Reminder vor Gebetsende (default: 15)
  google_calendar_connected: boolean
  google_refresh_token?: string
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  emoji: string
  order: number
  active: boolean
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string // YYYY-MM-DD
  completed: boolean
  completed_at?: string
}

export interface Block {
  id: string
  user_id: string
  name: string
  type: 'deepwork' | 'calls' | 'team' | 'kunden' | 'vertrieb' | 'sport' | 'essen' | 'gebet' | 'custom'
  color: string
  start_time: string // HH:MM
  end_time: string // HH:MM
  days: string[] // ['montag', 'dienstag', etc.]
  is_relative_to_fajr: boolean
  fajr_offset_minutes?: number // z.B. +45 = 45 Min nach Fajr
  active: boolean
  created_at: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  type: 'block' | 'gebet' | 'essen' | 'custom' | 'google'
  google_event_id?: string
  created_at: string
}

export interface WorkoutChoice {
  id: string
  user_id: string
  date: string // YYYY-MM-DD
  time_slot: 'morgens' | 'mittags' | 'abends'
  created_at: string
}

// Default Habits
export const defaultHabits: Omit<Habit, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Koran lesen', emoji: '📖', order: 1, active: true },
  { name: 'Workout', emoji: '💪', order: 2, active: true },
  { name: 'Buch lesen', emoji: '📚', order: 3, active: true },
  { name: 'Instagram Story', emoji: '📱', order: 4, active: true },
  { name: 'Reel posten', emoji: '🎬', order: 5, active: true },
  { name: 'Dhikr', emoji: '🤲', order: 6, active: true },
]

// Default Blocks (Maurice-Style)
export const defaultBlocks: Omit<Block, 'id' | 'user_id' | 'created_at'>[] = [
  {
    name: 'Koran & Morgenroutine',
    type: 'custom',
    color: '#D4AF37',
    start_time: '07:00',
    end_time: '07:45',
    days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'],
    is_relative_to_fajr: true,
    fajr_offset_minutes: 20,
    active: true,
  },
  {
    name: 'Deep Work 1',
    type: 'deepwork',
    color: '#3b82f6',
    start_time: '07:45',
    end_time: '10:45',
    days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'],
    is_relative_to_fajr: true,
    fajr_offset_minutes: 65,
    active: true,
  },
  {
    name: 'Calls',
    type: 'calls',
    color: '#22c55e',
    start_time: '13:00',
    end_time: '15:00',
    days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'],
    is_relative_to_fajr: false,
    active: true,
  },
  {
    name: 'Deep Work 2',
    type: 'deepwork',
    color: '#3b82f6',
    start_time: '15:00',
    end_time: '18:00',
    days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'],
    is_relative_to_fajr: false,
    active: true,
  },
  {
    name: 'Team Meeting',
    type: 'team',
    color: '#eab308',
    start_time: '17:30',
    end_time: '18:00',
    days: ['montag', 'mittwoch', 'freitag'],
    is_relative_to_fajr: false,
    active: true,
  },
]
