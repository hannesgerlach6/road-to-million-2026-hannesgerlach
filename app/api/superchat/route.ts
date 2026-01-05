import { NextRequest, NextResponse } from 'next/server'
import { sendSMS, MessageTemplates } from '@/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, data } = body

    if (!to) {
      return NextResponse.json({ success: false, error: 'Telefonnummer fehlt' }, { status: 400 })
    }

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
        return NextResponse.json({ success: false, error: 'Unbekannter Nachrichtentyp' }, { status: 400 })
    }

    console.log('Sending SMS type:', type, 'to:', to)
    const result = await sendSMS({ to, message })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'SMS gesendet!' })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Server Fehler: ' + String(error) }, { status: 500 })
  }
}
