'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flame, 
  Dumbbell,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'
import { 
  recipes, 
  getDayPlan, 
  getCurrentWeek, 
  supplements,
  hautpflege,
  type Recipe 
} from '@/data/ernaehrung'

function ErnaehrungContent() {
  const searchParams = useSearchParams()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Check for recipe in URL
  useEffect(() => {
    const recipeId = searchParams.get('recipe')
    if (recipeId) {
      const recipe = recipes.find(r => r.id === recipeId)
      if (recipe) setSelectedRecipe(recipe)
    }
  }, [searchParams])
  
  // Plan Info
  const startDate = new Date('2026-01-06')
  const currentWeek = getCurrentWeek(startDate, currentDate)
  const todayPlan = getDayPlan(currentDate, currentWeek)
  
  // Get recipes for today
  const fruehstueck = recipes.find(r => r.id === todayPlan.fruehstueck)!
  const mittag = recipes.find(r => r.id === todayPlan.mittag)!
  const snack = recipes.find(r => r.id === todayPlan.snack)!
  const abend = recipes.find(r => r.id === todayPlan.abend)!
  
  // Kombinierte Makros für den Tag (ohne Mittag)
  const totalCalories = fruehstueck.calories + snack.calories + mittag.calories + abend.calories
  const totalProtein = fruehstueck.protein + snack.protein + mittag.protein + abend.protein
  const totalCarbs = fruehstueck.carbs + snack.carbs + mittag.carbs + abend.carbs
  const totalFat = fruehstueck.fat + snack.fat + mittag.fat + abend.fat
  
  const dayName = currentDate.toLocaleDateString('de-DE', { weekday: 'long' })
  const dateStr = currentDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  
  // Navigate days
  const prevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }
  
  const nextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        {/* Header with Date Navigation */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevDay} className="p-2 hover:bg-dark-800 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-dark-400" />
            </button>
            <div className="text-center">
              <h1 className="font-display text-xl text-white">{dayName}</h1>
              <p className="text-dark-400 text-sm">{dateStr} • Woche {currentWeek}</p>
            </div>
            <button onClick={nextDay} className="p-2 hover:bg-dark-800 rounded-lg">
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </button>
          </div>
          
          {/* Makros Übersicht */}
          <div className="card gold-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400 text-sm">Tagesziele</span>
              <span className="text-gold-500 font-medium">{totalCalories} kcal</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display text-white">{totalProtein}g</p>
                <p className="text-dark-500 text-xs">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display text-white">{totalCarbs}g</p>
                <p className="text-dark-500 text-xs">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display text-white">{totalFat}g</p>
                <p className="text-dark-500 text-xs">Fett</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Supplements Morgens */}
        <div className="card border-teal-500/30 bg-teal-500/5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💊</span>
            <span className="font-medium text-white">07:00 - Morgen-Supplements</span>
          </div>
          <div className="space-y-2">
            {supplements.filter(s => s.time === 'morgens').map((sup, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-dark-300">{sup.name}</span>
                <span className="text-dark-500">{sup.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mahlzeiten */}
        <div className="space-y-4 mb-6">
          <h2 className="font-display text-lg text-white">🍽️ Mahlzeiten</h2>
          
          {/* Frühstück */}
          <MealCard 
            time="07:30"
            label="Frühstück"
            recipe={fruehstueck}
            onClick={() => setSelectedRecipe(fruehstueck)}
          />
          
          {/* Snack */}
          <MealCard 
            time="16:00"
            label="Snack"
            recipe={snack}
            onClick={() => setSelectedRecipe(snack)}
          />
          
          {/* Abendessen (Mega Portion) */}
          <div className="card hover:border-gold-500/50 transition-all cursor-pointer" onClick={() => setSelectedRecipe(abend)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[50px]">
                  <p className="text-dark-500 text-xs">Abend</p>
                  <p className="text-gold-500 font-medium">19:00</p>
                </div>
                <div>
                  <p className="font-medium text-white">🍽️ Mega Abendessen</p>
                  <p className="text-dark-400 text-sm">
                    {mittag.calories + abend.calories} kcal • {mittag.protein + abend.protein}g Protein
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-dark-400" />
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-dark-800 rounded text-xs text-dark-300">
                {abend.emoji} {abend.name}
              </span>
              <span className="px-2 py-1 bg-dark-800 rounded text-xs text-dark-300">
                {mittag.emoji} {mittag.name}
              </span>
            </div>
          </div>
        </div>
        
        {/* Supplements Abends */}
        <div className="card border-purple-500/30 bg-purple-500/5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">💊</span>
            <span className="font-medium text-white">22:00 - Abend-Supplements</span>
          </div>
          <div className="space-y-2">
            {supplements.filter(s => s.time === 'abends').map((sup, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-dark-300">{sup.name}</span>
                <span className="text-dark-500">{sup.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hautpflege */}
        <div className="card border-pink-500/30 bg-pink-500/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🧴</span>
            <span className="font-medium text-white">22:00 - Hautpflege</span>
          </div>
          <ol className="space-y-2 text-sm text-dark-300">
            {hautpflege.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-dark-500">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </main>
      
      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
      
      <BottomNav />
    </div>
  )
}

export default function ErnaehrungPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="text-gold-500">Laden...</div></div>}>
      <ErnaehrungContent />
    </Suspense>
  )
}

// Meal Card Component
function MealCard({ time, label, recipe, onClick }: { 
  time: string
  label: string
  recipe: Recipe
  onClick: () => void 
}) {
  return (
    <div 
      className="card hover:border-gold-500/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center min-w-[50px]">
            <p className="text-dark-500 text-xs">{label}</p>
            <p className="text-gold-500 font-medium">{time}</p>
          </div>
          <div>
            <p className="font-medium text-white">{recipe.emoji} {recipe.name}</p>
            <p className="text-dark-400 text-sm">
              {recipe.calories} kcal • {recipe.protein}g Protein
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-dark-400" />
      </div>
    </div>
  )
}

// Recipe Detail Modal
function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  
  const toggleStep = (index: number) => {
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedSteps(newChecked)
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <button onClick={onClose} className="p-2 hover:bg-dark-800 rounded-lg">
                <X className="w-5 h-5 text-dark-400" />
              </button>
              <div className="flex items-center gap-2 text-dark-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime} Min</span>
              </div>
            </div>
            
            <h1 className="font-display text-2xl text-white mb-2">
              {recipe.emoji} {recipe.name}
            </h1>
            
            {/* Makros */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="text-center p-3 bg-dark-800 rounded-xl">
                <p className="text-lg font-medium text-gold-500">{recipe.calories}</p>
                <p className="text-dark-500 text-xs">kcal</p>
              </div>
              <div className="text-center p-3 bg-dark-800 rounded-xl">
                <p className="text-lg font-medium text-white">{recipe.protein}g</p>
                <p className="text-dark-500 text-xs">Protein</p>
              </div>
              <div className="text-center p-3 bg-dark-800 rounded-xl">
                <p className="text-lg font-medium text-white">{recipe.carbs}g</p>
                <p className="text-dark-500 text-xs">Carbs</p>
              </div>
              <div className="text-center p-3 bg-dark-800 rounded-xl">
                <p className="text-lg font-medium text-white">{recipe.fat}g</p>
                <p className="text-dark-500 text-xs">Fett</p>
              </div>
            </div>
          </div>
          
          {/* Zutaten */}
          <div className="p-6 border-b border-dark-700">
            <h2 className="font-display text-lg text-white mb-4">📝 Zutaten</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-center gap-3 text-dark-300">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Zubereitung */}
          <div className="p-6">
            <h2 className="font-display text-lg text-white mb-4">👨‍🍳 Zubereitung</h2>
            <div className="space-y-3">
              {recipe.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    checkedSteps.has(i)
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      checkedSteps.has(i) ? 'bg-green-500' : 'bg-dark-700'
                    }`}>
                      {checkedSteps.has(i) ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs text-dark-400">{i + 1}</span>
                      )}
                    </div>
                    <p className={`text-sm ${checkedSteps.has(i) ? 'text-dark-400 line-through' : 'text-dark-200'}`}>
                      {step}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Tipp */}
            {recipe.tip && (
              <div className="mt-6 p-4 bg-gold-500/10 border border-gold-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gold-200">{recipe.tip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
