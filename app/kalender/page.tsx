'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'

export default function KalenderPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthName = currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl text-white">📅 Kalender</h1>
            <button className="btn-gold flex items-center gap-2 py-2 px-4">
              <Plus className="w-4 h-4" />
              Event
            </button>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() - 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-dark-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-dark-400" />
            </button>
            <p className="font-display text-lg text-white">{monthName}</p>
            <button 
              onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setMonth(newDate.getMonth() + 1)
                setCurrentDate(newDate)
              }}
              className="p-2 hover:bg-dark-800 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </button>
          </div>
        </header>
        
        {/* Calendar Grid */}
        <div className="card mb-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <div key={day} className="text-center text-dark-500 text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 2
              const isCurrentMonth = dayNum > 0 && dayNum <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
              const isToday = isCurrentMonth && dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()
              
              return (
                <button
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    isToday
                      ? 'bg-gold-500 text-dark-900 font-bold'
                      : isCurrentMonth
                        ? 'hover:bg-dark-800 text-white'
                        : 'text-dark-700'
                  }`}
                >
                  {isCurrentMonth ? dayNum : ''}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Today's Schedule */}
        <div className="card">
          <h2 className="font-display text-lg text-white mb-4">Heute</h2>
          <p className="text-dark-400 text-sm">
            Verbinde Google Calendar um deine Termine hier zu sehen.
          </p>
          <button className="btn-secondary mt-4">
            Google Calendar verbinden
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
