import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage, MessageTemplates } from '@/lib/superchat'

// Call this at 6:00 AM via external cron

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'Bad Kissingen'
    const phone = searchParams.get('phone')
    const secret = searchParams.get('secret')

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

    // Check if workout day (Mo, Mi, Fr)
    const dayOfWeek = new Date().getDay()
    const isWorkoutDay = [1, 3, 5].includes(dayOfWeek)

    const summaryData = {
      prayers: [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha },
      ],
      meals: [
        { time: '08:00', name: 'Frühstück' },
        { time: '12:30', name: 'Mittagessen' },
        { time: '19:00', name: 'Abendessen' },
      ],
      habits: [
        'Koran lesen',
        'Instagram Story posten',
        'Reel posten',
        'Buch lesen (30 Min)',
        'Dhikr',
      ],
      workout: isWorkoutDay 
        ? 'Heute ist Trainingstag! 💪\nKlimmzüge, Dips, Rudern, Pike Push-ups, Leg Raises' 
        : undefined,
    }

    const result = await sendWhatsAppMessage({
      to: phone,
      message: MessageTemplates.morningSummary(summaryData),
    })

    return NextResponse.json({
      success: result.success,
      message: 'Morning summary sent',
    })
  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const runtime = 'edge'
