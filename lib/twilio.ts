// Twilio SMS API Helper

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ''

export interface SendMessageParams {
  to: string // Phone number with country code, e.g. +491234567890
  message: string
}

export async function sendSMS({ to, message }: SendMessageParams): Promise<{ success: boolean; error?: string }> {
  // Check if credentials are set
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Twilio credentials not configured')
    return { 
      success: false, 
      error: 'Twilio nicht konfiguriert. Bitte TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN und TWILIO_PHONE_NUMBER in Vercel setzen.' 
    }
  }

  try {
    // Format phone number
    let phoneNumber = to.replace(/[\s\-\(\)]/g, '')
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+49' + phoneNumber.substring(1)
    } else if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber
    }

    console.log('Sending SMS via Twilio:', { to: phoneNumber, messageLength: message.length })

    // Twilio API - Basic Auth
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_PHONE_NUMBER,
          To: phoneNumber,
          Body: message,
        }),
      }
    )

    const result = await response.json()
    console.log('Twilio Response:', response.status, JSON.stringify(result))

    if (!response.ok) {
      const errorMsg = result.message || result.error_message || JSON.stringify(result)
      return { success: false, error: `Twilio Error (${response.status}): ${errorMsg}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Twilio API Error:', error)
    return { success: false, error: String(error) }
  }
}

// Message Templates - Kürzer für SMS (160 Zeichen Limit beachten, aber Multi-SMS möglich)
export const MessageTemplates = {
  prayerReminder: (prayer: string, time: string) => 
    `🕌 ${prayer} in 10 Min (${time}) - Allahu Akbar`,

  morningSummary: (data: { 
    prayers: { name: string; time: string }[], 
    habits: string[],
    workout?: string
  }) => {
    let msg = `☀️ Guten Morgen!\n\n`
    msg += `🕌 ${data.prayers.map(p => `${p.name} ${p.time}`).join(', ')}\n\n`
    msg += `✅ ${data.habits.join(', ')}\n`
    if (data.workout) {
      msg += `\n💪 ${data.workout}`
    }
    msg += `\n\nBismillah! 🔥`
    return msg
  },

  eveningCheck: (completed: number, total: number, missing: string[]) => {
    let msg = `🌙 Abend-Check\n\n`
    msg += `${completed}/${total} Habits erledigt.\n`
    if (missing.length > 0) {
      msg += `\nOffen: ${missing.join(', ')}\n`
    }
    msg += `\nMorgen neuer Tag! 💪`
    return msg
  },

  mealReminder: (meal: { name: string; recipe?: string; calories: number; protein: number }) => {
    let msg = `🍽️ ${meal.name}\n`
    msg += `${meal.calories}kcal | ${meal.protein}g Protein\n`
    msg += `Guten Appetit! 🤲`
    return msg
  },

  workoutReminder: (exercises: { name: string; sets: number; reps: string }[]) => {
    let msg = `💪 Workout!\n\n`
    msg += exercises.map(e => `${e.name} ${e.sets}x${e.reps}`).join('\n')
    msg += `\n\nYallah! 🔥`
    return msg
  },

  koranReminder: () => 
    `📖 Koran-Reminder\n\nNimm dir 10-15 Min zum Lesen.\n\nبِسْمِ اللَّهِ 🤲`,
}
