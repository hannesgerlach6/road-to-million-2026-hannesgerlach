import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json()
    
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, message' },
        { status: 400 }
      )
    }
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER
    
    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { success: false, error: 'Twilio not configured' },
        { status: 500 }
      )
    }
    
    // Twilio API call
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message,
      }),
    })
    
    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        messageId: data.sid,
        status: data.status,
      })
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to send SMS' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('SMS Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
