import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage, MessageTemplates } from '@/lib/superchat'

// Call this at 21:00 via external cron

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const secret = searchParams.get('secret')

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    // Get habits status from request body
    const body = await request.json()
    const { habits } = body

    // habits format: [{ name: string, completed: boolean }]
    const completed = habits.filter((h: any) => h.completed).length
    const total = habits.length
    const missing = habits.filter((h: any) => !h.completed).map((h: any) => h.name)

    const result = await sendWhatsAppMessage({
      to: phone,
      message: MessageTemplates.eveningCheck(completed, total, missing),
    })

    return NextResponse.json({
      success: result.success,
      completed,
      total,
      missing,
    })
  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Also support GET for simple check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  // Default habits if no body provided
  const defaultHabits = [
    { name: 'Koran lesen', completed: false },
    { name: 'Workout', completed: false },
    { name: 'Buch lesen', completed: false },
    { name: 'Instagram Story', completed: false },
    { name: 'Reel posten', completed: false },
    { name: 'Dhikr', completed: false },
  ]

  const completed = 0
  const total = defaultHabits.length
  const missing = defaultHabits.map(h => h.name)

  const result = await sendWhatsAppMessage({
    to: phone,
    message: MessageTemplates.eveningCheck(completed, total, missing),
  })

  return NextResponse.json({
    success: result.success,
    message: 'Evening check sent (default habits)',
  })
}

export const runtime = 'edge'
