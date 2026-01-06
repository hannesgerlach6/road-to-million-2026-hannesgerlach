'use client'

import { useState } from 'react'
import { 
  Phone, 
  MapPin, 
  Bell, 
  Calendar,
  Link2,
  Check,
  ExternalLink,
  Dumbbell
} from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'

export default function EinstellungenPage() {
  const [settings, setSettings] = useState({
    phone: '',
    city: 'Bad Kissingen',
    notificationsEnabled: true,
    workoutDays: ['montag', 'donnerstag', 'sonntag'],
    mealCount: 3,
    fajrOffset: 20,
    prayerEndReminder: 15,
    googleCalendarConnected: false,
  })
  
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  
  const workoutOptions = [
    { key: 'montag', label: 'Mo' },
    { key: 'dienstag', label: 'Di' },
    { key: 'mittwoch', label: 'Mi' },
    { key: 'donnerstag', label: 'Do' },
    { key: 'freitag', label: 'Fr' },
    { key: 'samstag', label: 'Sa' },
    { key: 'sonntag', label: 'So' },
  ]
  
  const toggleWorkoutDay = (day: string) => {
    if (settings.workoutDays.includes(day)) {
      setSettings({
        ...settings,
        workoutDays: settings.workoutDays.filter(d => d !== day)
      })
    } else {
      setSettings({
        ...settings,
        workoutDays: [...settings.workoutDays, day]
      })
    }
  }
  
  const handleTestSMS = async () => {
    if (!settings.phone) {
      setTestResult('Bitte zuerst Telefonnummer eingeben!')
      return
    }
    
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: settings.phone,
          message: '✅ Test erfolgreich!\n\nDeine Road to Million 2026 App ist verbunden.\n\nBismillah! 🔥'
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTestResult('✅ Test-SMS gesendet! Check dein Handy.')
      } else {
        setTestResult('❌ Fehler: ' + (result.error || 'Unbekannt'))
      }
    } catch (error) {
      setTestResult('❌ Netzwerk-Fehler!')
    }
    
    setTesting(false)
  }
  
  const handleSave = () => {
    // TODO: Save to Supabase
    localStorage.setItem('r2m_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleConnectGoogle = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/signin/google'
  }
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        <header className="mb-8">
          <h1 className="font-display text-2xl text-white">⚙️ Einstellungen</h1>
          <p className="text-dark-400">Personalisiere deine App</p>
        </header>
        
        <div className="space-y-6">
          {/* Telefonnummer */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">SMS Benachrichtigungen</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              Deine Nummer mit Ländervorwahl (z.B. +491234567890)
            </p>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+49..."
              className="w-full mb-4"
            />
            <button
              onClick={handleTestSMS}
              disabled={testing || !settings.phone}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin" />
                  Sende...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Test SMS senden
                </>
              )}
            </button>
            {testResult && (
              <p className={`mt-3 text-sm ${testResult.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
                {testResult}
              </p>
            )}
          </div>
          
          {/* Stadt */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Stadt</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              Für Gebetszeiten und lokale Moscheen
            </p>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              placeholder="z.B. Bad Kissingen"
              className="w-full"
            />
          </div>
          
          {/* Workout Tage */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Workout-Tage</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              An welchen Tagen trainierst du?
            </p>
            <div className="flex gap-2">
              {workoutOptions.map((day) => (
                <button
                  key={day.key}
                  onClick={() => toggleWorkoutDay(day.key)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    settings.workoutDays.includes(day.key)
                      ? 'bg-purple-500 text-white'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Gebets-Reminder */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Gebets-Reminder</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-dark-400 text-sm block mb-2">
                  Aufstehen nach Fajr (Minuten)
                </label>
                <input
                  type="number"
                  value={settings.fajrOffset}
                  onChange={(e) => setSettings({ ...settings, fajrOffset: parseInt(e.target.value) || 20 })}
                  className="w-24"
                  min={0}
                  max={60}
                />
              </div>
              
              <div>
                <label className="text-dark-400 text-sm block mb-2">
                  Reminder vor Gebetsende (Minuten)
                </label>
                <input
                  type="number"
                  value={settings.prayerEndReminder}
                  onChange={(e) => setSettings({ ...settings, prayerEndReminder: parseInt(e.target.value) || 15 })}
                  className="w-24"
                  min={5}
                  max={30}
                />
              </div>
            </div>
          </div>
          
          {/* Google Calendar */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Google Calendar</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              Synchronisiere deine Termine mit Google Calendar
            </p>
            
            {settings.googleCalendarConnected ? (
              <div className="flex items-center gap-2 text-green-500">
                <Check className="w-5 h-5" />
                <span>Verbunden</span>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogle}
                className="btn-secondary flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Google Calendar verbinden
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Notifications Toggle */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gold-400" />
                <div>
                  <h2 className="text-lg font-display text-white">Benachrichtigungen</h2>
                  <p className="text-dark-400 text-sm">SMS Reminder aktivieren</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                className={`w-14 h-8 rounded-full transition-all ${
                  settings.notificationsEnabled ? 'bg-gold-500' : 'bg-dark-700'
                }`}
              >
                <div 
                  className={`w-6 h-6 bg-white rounded-full transition-all ${
                    settings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Gespeichert!
              </>
            ) : (
              'Einstellungen speichern'
            )}
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
