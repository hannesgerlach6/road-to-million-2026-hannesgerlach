'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Phone, MapPin, Bell, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface UserSettings {
  phone: string
  city: string
  notificationsEnabled: boolean
}

const GERMAN_CITIES = [
  'Bad Kissingen',
  'Berlin',
  'München',
  'Hamburg',
  'Frankfurt',
  'Köln',
  'Düsseldorf',
  'Stuttgart',
  'Dortmund',
  'Essen',
  'Leipzig',
  'Bremen',
  'Dresden',
  'Hannover',
  'Nürnberg',
  'Duisburg',
  'Bochum',
  'Wuppertal',
  'Bielefeld',
  'Bonn',
  'Münster',
  'Karlsruhe',
  'Mannheim',
  'Augsburg',
  'Wiesbaden',
  'Dubai',
]

export default function Einstellungen() {
  const [settings, setSettings] = useState<UserSettings>({
    phone: '',
    city: 'Bad Kissingen',
    notificationsEnabled: true,
  })
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('r2m-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('r2m-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestNotification = async () => {
    if (!settings.phone) {
      setTestResult('Bitte zuerst Telefonnummer eingeben!')
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/superchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          to: settings.phone,
          data: { message: '✅ Test erfolgreich!\n\nDeine Road to Million 2026 App ist verbunden.\n\nBismillah! 🔥' },
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

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-gold-400 transition-all mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zum Dashboard
          </Link>
          <h1 className="text-3xl font-display text-white">Einstellungen</h1>
          <p className="text-dark-400 mt-2">Konfiguriere deine Notifications und Präferenzen</p>
        </header>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Phone Number */}
          <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Handynummer für SMS</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              Deine Nummer mit Ländervorwahl (z.B. +491234567890)
            </p>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+49..."
              className="w-full"
            />
            <p className="text-dark-500 text-xs mt-2">
              SMS Notifications via Twilio
            </p>
          </div>

          {/* City Selection */}
          <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-display text-white">Stadt</h2>
            </div>
            <p className="text-dark-400 text-sm mb-4">
              Für korrekte Gebetszeiten
            </p>
            <select
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              className="w-full"
            >
              {GERMAN_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gold-400" />
                <div>
                  <h2 className="text-lg font-display text-white">SMS Notifications</h2>
                  <p className="text-dark-400 text-sm">SMS Benachrichtigungen aktivieren</p>
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

          {/* Test Notification */}
          <div className="bg-dark-900/50 gold-border rounded-2xl p-6">
            <h2 className="text-lg font-display text-white mb-4">Test SMS</h2>
            <p className="text-dark-400 text-sm mb-4">
              Sende eine Test-SMS um die Verbindung zu prüfen
            </p>
            <button
              onClick={handleTestNotification}
              disabled={testing || !settings.phone}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-4"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Gespeichert!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Speichern
              </>
            )}
          </button>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-dark-900/30 rounded-2xl p-6">
          <h3 className="text-gold-400 font-display mb-4">🔧 Twilio Setup</h3>
          <p className="text-dark-400 text-sm mb-4">
            Für SMS Notifications brauchst du diese Vercel Environment Variables:
          </p>
          <div className="space-y-3 text-xs font-mono">
            <div className="bg-dark-800 p-3 rounded-lg">
              <p className="text-dark-400 mb-1">Account SID:</p>
              <p className="text-gold-300">TWILIO_ACCOUNT_SID</p>
            </div>
            <div className="bg-dark-800 p-3 rounded-lg">
              <p className="text-dark-400 mb-1">Auth Token:</p>
              <p className="text-gold-300">TWILIO_AUTH_TOKEN</p>
            </div>
            <div className="bg-dark-800 p-3 rounded-lg">
              <p className="text-dark-400 mb-1">Twilio Nummer:</p>
              <p className="text-gold-300">TWILIO_PHONE_NUMBER</p>
            </div>
          </div>
          <p className="text-dark-500 text-xs mt-4">
            Findest du alles unter twilio.com → Console → Account Info
          </p>
        </div>
      </div>
    </main>
  )
}
