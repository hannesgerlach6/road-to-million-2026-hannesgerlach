import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage, MessageTemplates } from '@/lib/superchat'

// This endpoint checks if a prayer is coming up in 10 minutes
// Call this every 5 minutes via external cron (Make.com, cron-job.org, etc.)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'Bad Kissingen'
    const phone = searchParams.get('phone')
    const secret = searchParams.get('secret')

    // Security check
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    // Fetch prayer times
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Germany&method=2`
    )
    const data = await response.json()
    const timings = data.data.timings

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const prayers = [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha },
    ]

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number)
      const prayerMinutes = hours * 60 + minutes
      const diff = prayerMinutes - currentMinutes

      // If prayer is in 8-12 minutes (to account for cron timing)
      if (diff >= 8 && diff <= 12) {
        const result = await sendWhatsAppMessage({
          to: phone,
          message: MessageTemplates.prayerReminder(prayer.name, prayer.time),
        })

        return NextResponse.json({
          success: true,
          sent: true,
          prayer: prayer.name,
          time: prayer.time,
        })
      }
    }

    return NextResponse.json({
      success: true,
      sent: false,
      message: 'No prayer coming up in the next 10 minutes',
    })
  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Vercel Cron Config (requires Pro plan)
export const runtime = 'edge'
