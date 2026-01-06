'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react'
import BottomNav, { SideNav } from '@/components/BottomNav'

interface Block {
  id: string
  name: string
  type: 'deepwork' | 'calls' | 'team' | 'kunden' | 'vertrieb' | 'sport' | 'custom'
  startTime: string
  endTime: string
  days: string[]
  color: string
}

const blockTypes = [
  { type: 'deepwork', label: 'Deep Work', color: '#3b82f6', emoji: '🧠' },
  { type: 'calls', label: 'Calls', color: '#22c55e', emoji: '📞' },
  { type: 'team', label: 'Team Meeting', color: '#eab308', emoji: '👥' },
  { type: 'kunden', label: 'Kundenmeetings', color: '#f97316', emoji: '🤝' },
  { type: 'vertrieb', label: 'Vertrieb', color: '#ef4444', emoji: '💼' },
  { type: 'sport', label: 'Sport', color: '#a855f7', emoji: '💪' },
  { type: 'custom', label: 'Custom', color: '#6b7280', emoji: '📌' },
]

const defaultBlocks: Block[] = [
  { id: '1', name: 'Deep Work 1', type: 'deepwork', startTime: '07:45', endTime: '10:45', days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'], color: '#3b82f6' },
  { id: '2', name: 'Calls', type: 'calls', startTime: '13:00', endTime: '15:00', days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'], color: '#22c55e' },
  { id: '3', name: 'Deep Work 2', type: 'deepwork', startTime: '15:00', endTime: '18:00', days: ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'], color: '#3b82f6' },
  { id: '4', name: 'Team Meeting', type: 'team', startTime: '17:30', endTime: '18:00', days: ['montag', 'mittwoch', 'freitag'], color: '#eab308' },
]

const dayOptions = [
  { key: 'montag', label: 'Mo' },
  { key: 'dienstag', label: 'Di' },
  { key: 'mittwoch', label: 'Mi' },
  { key: 'donnerstag', label: 'Do' },
  { key: 'freitag', label: 'Fr' },
  { key: 'samstag', label: 'Sa' },
  { key: 'sonntag', label: 'So' },
]

export default function BloeckePage() {
  const [blocks, setBlocks] = useState<Block[]>(defaultBlocks)
  const [showModal, setShowModal] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  
  const deleteBlock = (id: string) => {
    if (confirm('Block wirklich löschen?')) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }
  
  const getBlockType = (type: string) => blockTypes.find(t => t.type === type)
  
  return (
    <div className="min-h-screen bg-dark-950 pb-20 lg:pb-0 lg:pl-64">
      <SideNav />
      
      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl text-white">💼 Tagesblöcke</h1>
              <p className="text-dark-400 text-sm">Maurice-Style Timeblocking</p>
            </div>
            <button 
              onClick={() => {
                setEditingBlock(null)
                setShowModal(true)
              }}
              className="btn-gold flex items-center gap-2 py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              Block
            </button>
          </div>
        </header>
        
        {/* Info Card */}
        <div className="card gold-border mb-6">
          <p className="text-dark-300 text-sm">
            💡 <strong className="text-gold-500">Tipp von Maurice:</strong> Strukturiere deinen Tag in feste Blöcke. 
            Deep Work = keine Unterbrechungen. Calls = nur in dieser Zeit. 
            Das System führt deine Mitarbeiter, nicht du.
          </p>
        </div>
        
        {/* Block Types Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {blockTypes.map((type) => (
            <div 
              key={type.type}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ backgroundColor: `${type.color}20`, color: type.color }}
            >
              <span>{type.emoji}</span>
              <span>{type.label}</span>
            </div>
          ))}
        </div>
        
        {/* Blocks List */}
        <div className="space-y-3">
          {blocks.map((block) => {
            const blockType = getBlockType(block.type)
            
            return (
              <div
                key={block.id}
                className="card hover:border-dark-600 transition-all"
                style={{ borderLeftWidth: '4px', borderLeftColor: block.color }}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-dark-600 cursor-grab" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{blockType?.emoji}</span>
                      <p className="font-medium text-white">{block.name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-dark-400">
                      <span>{block.startTime} - {block.endTime}</span>
                      <span>•</span>
                      <span>
                        {block.days.map(d => dayOptions.find(o => o.key === d)?.label).join(', ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBlock(block)
                        setShowModal(true)
                      }}
                      className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-500 mb-4">Noch keine Blöcke angelegt</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-gold"
            >
              Ersten Block erstellen
            </button>
          </div>
        )}
      </main>
      
      {/* Add/Edit Modal */}
      {showModal && (
        <BlockModal
          block={editingBlock}
          onSave={(block) => {
            if (editingBlock) {
              setBlocks(blocks.map(b => b.id === block.id ? block : b))
            } else {
              setBlocks([...blocks, { ...block, id: Date.now().toString() }])
            }
            setShowModal(false)
            setEditingBlock(null)
          }}
          onClose={() => {
            setShowModal(false)
            setEditingBlock(null)
          }}
        />
      )}
      
      <BottomNav />
    </div>
  )
}

// Block Modal Component
function BlockModal({ 
  block, 
  onSave, 
  onClose 
}: { 
  block: Block | null
  onSave: (block: Block) => void
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    name: block?.name || '',
    type: block?.type || 'deepwork',
    startTime: block?.startTime || '09:00',
    endTime: block?.endTime || '12:00',
    days: block?.days || ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'],
  })
  
  const selectedType = blockTypes.find(t => t.type === formData.type)
  
  const toggleDay = (day: string) => {
    if (formData.days.includes(day)) {
      setFormData({ ...formData, days: formData.days.filter(d => d !== day) })
    } else {
      setFormData({ ...formData, days: [...formData.days, day] })
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave({
        id: block?.id || '',
        name: formData.name,
        type: formData.type as Block['type'],
        startTime: formData.startTime,
        endTime: formData.endTime,
        days: formData.days,
        color: selectedType?.color || '#6b7280',
      })
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-900 rounded-2xl border border-dark-700 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-white">
            {block ? 'Block bearbeiten' : 'Neuer Block'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-800 rounded-lg">
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Block Type */}
          <div>
            <label className="block text-dark-400 text-sm mb-2">Typ</label>
            <div className="grid grid-cols-4 gap-2">
              {blockTypes.map((type) => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.type as Block['type'] })}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    formData.type === type.type
                      ? 'ring-2 ring-gold-500'
                      : 'hover:bg-dark-800'
                  }`}
                  style={{ backgroundColor: formData.type === type.type ? `${type.color}20` : undefined }}
                >
                  <span className="text-xl">{type.emoji}</span>
                  <span className="text-xs text-dark-400">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label className="block text-dark-400 text-sm mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Deep Work Vormittag"
              className="w-full"
            />
          </div>
          
          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-400 text-sm mb-2">Start</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-dark-400 text-sm mb-2">Ende</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Days */}
          <div>
            <label className="block text-dark-400 text-sm mb-2">Tage</label>
            <div className="flex gap-2">
              {dayOptions.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    formData.days.includes(day.key)
                      ? 'bg-gold-500 text-dark-900'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit */}
          <button type="submit" className="btn-gold w-full">
            {block ? 'Speichern' : 'Erstellen'}
          </button>
        </form>
      </div>
    </div>
  )
}
