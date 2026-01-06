'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  Moon, 
  Utensils, 
  CheckSquare, 
  Briefcase, 
  ShoppingCart, 
  Settings 
} from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/kalender', icon: Calendar, label: 'Kalender' },
  { href: '/gebete', icon: Moon, label: 'Gebete' },
  { href: '/ernaehrung', icon: Utensils, label: 'Essen' },
  { href: '/habits', icon: CheckSquare, label: 'Habits' },
  { href: '/bloecke', icon: Briefcase, label: 'Blöcke' },
  { href: '/einkaufen', icon: ShoppingCart, label: 'Einkauf' },
  { href: '/einstellungen', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  
  // Nur die wichtigsten 5 Tabs in der Bottom Nav (für Mobile)
  const mainTabs = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/kalender', icon: Calendar, label: 'Kalender' },
    { href: '/gebete', icon: Moon, label: 'Gebete' },
    { href: '/habits', icon: CheckSquare, label: 'Habits' },
    { href: '/einstellungen', icon: Settings, label: 'Settings' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur-lg border-t border-dark-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href !== '/' && pathname.startsWith(tab.href))
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive 
                  ? 'text-gold-500' 
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Sidebar Navigation für größere Screens
export function SideNav() {
  const pathname = usePathname()
  
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-dark-900/50 border-r border-dark-800 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-dark-800">
        <h1 className="font-display text-2xl text-gold-500">Road to Million</h1>
        <p className="text-dark-400 text-sm">2026</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href !== '/' && pathname.startsWith(tab.href))
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/30' 
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-dark-800">
        <p className="text-dark-500 text-xs text-center">
          Bismillah, pack es an! 🔥
        </p>
      </div>
    </aside>
  )
}
