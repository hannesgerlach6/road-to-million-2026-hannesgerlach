import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'Bad Kissingen'
  const country = searchParams.get('country') || 'Germany'
  
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times')
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      timings: data.data.timings,
      date: data.data.date,
      city,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prayer times' },
      { status: 500 }
    )
  }
}
