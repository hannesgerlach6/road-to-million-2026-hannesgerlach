import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage, MessageTemplates } from '@/lib/superchat'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, data } = body

    let message = ''

    switch (type) {
      case 'prayer':
        message = MessageTemplates.prayerReminder(data.prayer, data.time)
        break
      case 'morning':
        message = MessageTemplates.morningSummary(data)
        break
      case 'evening':
        message = MessageTemplates.eveningCheck(data.completed, data.total, data.missing)
        break
      case 'meal':
        message = MessageTemplates.mealReminder(data)
        break
      case 'workout':
        message = MessageTemplates.workoutReminder(data.exercises)
        break
      case 'koran':
        message = MessageTemplates.koranReminder()
        break
      case 'custom':
        message = data.message
        break
      default:
        return NextResponse.json({ error: 'Unknown message type' }, { status: 400 })
    }

    const result = await sendWhatsAppMessage({ to, message })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Message sent!' })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
