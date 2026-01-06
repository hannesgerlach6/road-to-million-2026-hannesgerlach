'use client'

import { useState } from 'react'
import { Check, ShoppingCart, Store, Leaf, Apple, Droplets } from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'
import { einkaufsliste } from '@/data/ernaehrung'

export default function EinkaufenPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  
  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }
  
  const categories = [
    { key: 'halalMetzger', label: 'Halal Metzger', icon: Store, color: 'text-red-400', items: einkaufsliste.halalMetzger },
    { key: 'supermarkt', label: 'Supermarkt', icon: ShoppingCart, color: 'text-blue-400', items: einkaufsliste.supermarkt },
    { key: 'gemuese', label: 'Gemüse', icon: Leaf, color: 'text-green-400', items: einkaufsliste.gemuese },
    { key: 'obstNuesse', label: 'Obst & Nüsse', icon: Apple, color: 'text-orange-400', items: einkaufsliste.obstNuesse },
    { key: 'oeleGewuerze', label: 'Öle & Gewürze', icon: Droplets, color: 'text-yellow-400', items: einkaufsliste.oeleGewuerze },
  ]
  
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedCount = checkedItems.size
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl text-white mb-2">🛒 Einkaufsliste</h1>
          <p className="text-dark-400">Für 1 Woche Meal Prep</p>
        </header>
        
        {/* Progress */}
        <div className="card gold-border mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-dark-400">Fortschritt</span>
            <span className="text-gold-500 font-medium">{checkedCount}/{totalItems}</span>
          </div>
          <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="mt-3 text-green-500 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Alles eingekauft! Jetzt kann's losgehen mit Meal Prep 💪
            </p>
          )}
        </div>
        
        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => {
            const Icon = category.icon
            const categoryChecked = category.items.filter(i => checkedItems.has(i.item)).length
            
            return (
              <div key={category.key} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  <h2 className="font-display text-lg text-white">{category.label}</h2>
                  <span className="text-dark-500 text-sm ml-auto">
                    {categoryChecked}/{category.items.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const isChecked = checkedItems.has(item.item)
                    
                    return (
                      <button
                        key={item.item}
                        onClick={() => toggleItem(item.item)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isChecked
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-dark-800 hover:bg-dark-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isChecked ? 'bg-green-500' : 'border-2 border-dark-600'
                        }`}>
                          {isChecked && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`flex-1 text-left ${isChecked ? 'text-dark-400 line-through' : 'text-white'}`}>
                          {item.item}
                        </span>
                        <span className="text-dark-500 text-sm">{item.menge}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Reset Button */}
        <button
          onClick={() => setCheckedItems(new Set())}
          className="btn-secondary w-full mt-6"
        >
          Liste zurücksetzen
        </button>
      </main>
      
      <BottomNav />
    </div>
  )
}
